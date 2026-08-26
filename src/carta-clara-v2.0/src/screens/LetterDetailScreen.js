import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { typeScale } from '../theme/typography';
import DeadlineBadge from '../components/DeadlineBadge';
import { getLetter, deleteLetter, saveLetter } from '../services/storageService';
import { speak, stopSpeaking } from '../services/speechService';
import { formatDateEs, deadlineLabel } from '../utils/dateUtils';

export default function LetterDetailScreen({ route, navigation }) {
  const { letterId } = route.params;
  const [letter, setLetter] = useState(null);
  const [hablando, setHablando] = useState(false);

  useEffect(() => {
    getLetter(letterId).then(setLetter);
    return stopSpeaking;
  }, [letterId]);

  if (!letter) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Cargando…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const alternarAudio = () => {
    if (hablando) {
      stopSpeaking();
      setHablando(false);
    } else {
      speak(letter.resumenClaro, {
        onStart: () => setHablando(true),
        onDone: () => setHablando(false),
        onError: () => setHablando(false),
      });
    }
  };

  const marcarResuelta = async () => {
    const actualizada = { ...letter, estado: 'resuelta' };
    await saveLetter(actualizada);
    setLetter(actualizada);
  };

  const marcarLeida = async () => {
    const actualizada = { ...letter, leida: true };
    await saveLetter(actualizada);
    // Tras marcar como leída, volvemos al listado principal para que el
    // usuario vea de inmediato que la carta ya no aparece destacada como nueva.
    navigation.navigate('Home');
  };

  const confirmarBorrado = () => {
    Alert.alert(
      'Eliminar carta',
      'Se borrará esta carta y todos sus datos de tu dispositivo. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteLetter(letter.id);
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  const { texto: plazoTexto, expirado } = letter.fechaLimite
    ? deadlineLabel(letter.fechaLimite)
    : { texto: '', expirado: false };

  const hitos = construirLineaDeTiempo(letter);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.orgRow}>
          <View style={[styles.dot, { backgroundColor: letter.organismo.color }]} />
          <Text style={styles.organismo}>{letter.organismo.nombre}</Text>
        </View>
        <Text style={styles.title}>{letter.titulo}</Text>

        <View style={styles.badgeRow}>
          <DeadlineBadge urgencia={letter.urgencia} fechaLimite={letter.fechaLimite} />
        </View>

        {expirado && letter.estado === 'pendiente' && (
          <View style={styles.expiredBanner}>
            <Text style={styles.expiredText}>
              El plazo ya venció. Si aún necesitas actuar, contacta directamente con {letter.organismo.nombre} para consultar tus opciones.
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.audioBtn} onPress={alternarAudio}>
          <Text style={styles.audioIcon}>{hablando ? '⏸' : '🔊'}</Text>
          <Text style={styles.audioText}>{hablando ? 'Detener lectura' : 'Escuchar resumen'}</Text>
        </TouchableOpacity>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Resumen</Text>
          <Text style={styles.summaryText}>{letter.resumenClaro}</Text>
        </View>

        {letter.fechaLimite && letter.urgencia !== 'informativa' && (
          <View style={styles.timelineBlock}>
            <Text style={styles.timelineTitle}>Recordatorios</Text>
            {hitos.map((hito, idx) => (
              <View key={idx} style={styles.timelineRow}>
                <View style={[styles.timelineDot, hito.pasado && styles.timelineDotPast]} />
                <View style={styles.timelineTextBlock}>
                  <Text style={[styles.timelineLabel, hito.pasado && styles.timelineLabelPast]}>
                    {hito.etiqueta}
                  </Text>
                  <Text style={styles.timelineDate}>{formatDateEs(hito.fecha)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.metaBlock}>
          <Text style={styles.metaRow}>Recibida el {formatDateEs(letter.fechaRecepcion)}</Text>
          {letter.paginas > 1 && (
            <Text style={styles.metaRow}>{letter.paginas} páginas guardadas</Text>
          )}
        </View>

        {!letter.leida && (
          <TouchableOpacity style={styles.readBtn} onPress={marcarLeida}>
            <Text style={styles.readBtnText}>Marcar como leída</Text>
          </TouchableOpacity>
        )}

        {letter.estado === 'pendiente' && (
          <TouchableOpacity style={styles.resolveBtn} onPress={marcarResuelta}>
            <Text style={styles.resolveBtnText}>Marcar como resuelta</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.deleteBtn} onPress={confirmarBorrado}>
          <Text style={styles.deleteBtnText}>Eliminar esta carta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Construye los hitos de la línea de tiempo (7 días antes, 2 días antes,
 * el día del plazo) marcando cuáles ya pasaron, para reflejar visualmente
 * el estado real de los recordatorios programados.
 */
function construirLineaDeTiempo(letter) {
  if (!letter.fechaLimite) return [];
  const deadline = new Date(letter.fechaLimite);
  const now = new Date();

  const puntos = [
    { offset: 7, etiqueta: 'Primer aviso' },
    { offset: 2, etiqueta: 'Aviso urgente' },
    { offset: 0, etiqueta: 'Día del plazo' },
  ];

  return puntos.map((p) => {
    const fecha = new Date(deadline);
    fecha.setDate(fecha.getDate() - p.offset);
    return { etiqueta: p.etiqueta, fecha: fecha.toISOString(), pasado: fecha < now };
  });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ivory },
  scroll: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loading: { ...typeScale.body, color: colors.slate },
  orgRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  organismo: { ...typeScale.caption, color: colors.slate, fontFamily: 'AtkinsonHyperlegible_700Bold' },
  title: { ...typeScale.h1, color: colors.ink, marginBottom: 12 },
  badgeRow: { marginBottom: 16 },
  expiredBanner: {
    backgroundColor: colors.coralLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  expiredText: { ...typeScale.caption, color: colors.coralDark },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tealDark,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  audioIcon: { fontSize: 18, marginRight: 10 },
  audioText: { ...typeScale.bodyBold, color: colors.white },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLabel: { ...typeScale.caption, color: colors.teal, fontFamily: 'AtkinsonHyperlegible_700Bold', marginBottom: 8 },
  summaryText: { ...typeScale.bodyLarge, color: colors.ink },
  timelineBlock: { marginBottom: 24 },
  timelineTitle: { ...typeScale.h2, color: colors.ink, marginBottom: 14 },
  timelineRow: { flexDirection: 'row', marginBottom: 16 },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.amber,
    marginRight: 14,
    marginTop: 4,
  },
  timelineDotPast: { backgroundColor: colors.slateLight },
  timelineTextBlock: { flex: 1 },
  timelineLabel: { ...typeScale.bodyBold, color: colors.ink },
  timelineLabelPast: { color: colors.slateLight, textDecorationLine: 'line-through' },
  timelineDate: { ...typeScale.caption, color: colors.slate, marginTop: 2 },
  metaBlock: { marginBottom: 24, gap: 4 },
  metaRow: { ...typeScale.caption, color: colors.slateLight },
  readBtn: {
    backgroundColor: colors.tealLight,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  readBtnText: { ...typeScale.bodyBold, color: colors.tealDark },
  resolveBtn: {
    backgroundColor: colors.sageLight,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  resolveBtnText: { ...typeScale.bodyBold, color: colors.tealDark },
  deleteBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.coral,
  },
  deleteBtnText: { ...typeScale.bodyBold, color: colors.coralDark },
});
