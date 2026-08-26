import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Share,
} from 'react-native';
import { colors } from '../theme/colors';
import { typeScale } from '../theme/typography';
import PlaceholderChip from '../components/PlaceholderChip';
import { generateDraftMock } from '../services/translationService';

/**
 * El borrador se construye como una secuencia de fragmentos de texto y
 * marcadores editables ({{...}}), nunca como texto plano con datos
 * inventados. Esto es la respuesta directa al riesgo de privacidad
 * detectado en la revisión: la IA redacta la estructura de la carta,
 * pero cualquier dato personal (nombre, DNI, dirección...) lo introduce
 * el propio usuario.
 */
export default function DraftScreen({ route }) {
  const { analysis } = route.params;
  const [cargando, setCargando] = useState(true);
  const [cuerpo, setCuerpo] = useState('');
  const [marcadores, setMarcadores] = useState([]);

  useEffect(() => {
    generateDraftMock(analysis).then((draft) => {
      setCuerpo(draft.cuerpo);
      setMarcadores(draft.marcadores);
      setCargando(false);
    });
  }, []);

  const actualizarMarcador = (id, valor) => {
    setMarcadores((prev) => prev.map((m) => (m.id === id ? { ...m, valor } : m)));
  };

  const marcadoresFaltantes = marcadores.filter((m) => !m.valor).length;

  const textoFinal = () => {
    let texto = cuerpo;
    for (const m of marcadores) {
      texto = texto.split(`{{${m.id}}}`).join(m.valor || `[${m.etiqueta}]`);
    }
    return texto;
  };

  const compartir = async () => {
    await Share.share({ message: textoFinal() });
  };

  const renderCuerpoConChips = () => {
    const partes = cuerpo.split(/(\{\{[A-Z_]+\}\})/g);
    return (
      <Text style={styles.cuerpoText}>
        {partes.map((parte, idx) => {
          const match = parte.match(/^\{\{([A-Z_]+)\}\}$/);
          if (match) {
            const marcador = marcadores.find((m) => m.id === match[1]);
            if (!marcador) return null;
            return (
              <PlaceholderChipInline
                key={idx}
                marcador={marcador}
                onChange={actualizarMarcador}
              />
            );
          }
          return <Text key={idx}>{parte}</Text>;
        })}
      </Text>
    );
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.teal} />
          <Text style={styles.loadingText}>Redactando un borrador…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Borrador de respuesta</Text>
        <Text style={styles.subtitle}>
          Toca cada casilla de color para rellenar tus datos. Nada se rellena automáticamente.
        </Text>

        {marcadoresFaltantes > 0 && (
          <View style={styles.pendingBanner}>
            <Text style={styles.pendingText}>
              Faltan {marcadoresFaltantes} {marcadoresFaltantes === 1 ? 'dato' : 'datos'} por rellenar
            </Text>
          </View>
        )}

        <View style={styles.draftCard}>{renderCuerpoConChips()}</View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.shareBtn, marcadoresFaltantes > 0 && styles.shareBtnDisabled]}
          onPress={compartir}
        >
          <Text style={styles.shareBtnText}>
            {marcadoresFaltantes > 0 ? 'Rellena los datos para compartir' : 'Compartir borrador'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function PlaceholderChipInline({ marcador, onChange }) {
  return <PlaceholderChip marcador={marcador} onChange={onChange} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ivory },
  scroll: { padding: 20, paddingBottom: 20 },
  title: { ...typeScale.h1, color: colors.ink, marginBottom: 6 },
  subtitle: { ...typeScale.body, color: colors.slate, marginBottom: 18 },
  pendingBanner: {
    backgroundColor: colors.amberLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  pendingText: { ...typeScale.caption, color: colors.amberDark, fontFamily: 'AtkinsonHyperlegible_700Bold' },
  draftCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cuerpoText: { ...typeScale.bodyLarge, color: colors.ink, lineHeight: 30 },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { ...typeScale.body, color: colors.slate },
  bottomBar: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border },
  shareBtn: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareBtnDisabled: { backgroundColor: colors.slateLight },
  shareBtnText: { ...typeScale.bodyBold, color: colors.white },
});
