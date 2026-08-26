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
import TrustBanner from '../components/TrustBanner';
import { speak, stopSpeaking } from '../services/speechService';
import { saveLetter } from '../services/storageService';
import { scheduleDeadlineReminders, requestNotificationPermission } from '../services/notificationService';
import { formatDateEs } from '../utils/dateUtils';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

export default function SummaryScreen({ route, navigation }) {
  const { analysis, images } = route.params;
  const [hablando, setHablando] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => stopSpeaking, []);

  const alternarAudio = () => {
    if (hablando) {
      stopSpeaking();
      setHablando(false);
    } else {
      speak(analysis.resumenClaro, {
        onStart: () => setHablando(true),
        onDone: () => setHablando(false),
        onError: () => setHablando(false),
      });
    }
  };

  const guardarYContinuar = async () => {
    setGuardando(true);
    const letter = {
      id: uuidv4(),
      organismo: analysis.organismo,
      titulo: analysis.titulo,
      resumenCorto: analysis.resumenClaro.slice(0, 90) + (analysis.resumenClaro.length > 90 ? '…' : ''),
      resumenClaro: analysis.resumenClaro,
      fragmentoOriginal: analysis.fragmentoOriginal,
      accionRequerida: analysis.accionRequerida,
      urgencia: analysis.urgencia,
      estado: analysis.urgencia === 'informativa' ? 'informativa' : 'pendiente',
      leida: false,
      fechaRecepcion: new Date().toISOString(),
      fechaLimite: analysis.fechaLimite,
      paginas: images.length,
      tieneAudio: true,
      datosPersonalesDetectados: analysis.datosPersonalesDetectados,
    };

    await saveLetter(letter);

    if (letter.fechaLimite && letter.urgencia !== 'informativa') {
      const permitido = await requestNotificationPermission();
      if (permitido) {
        await scheduleDeadlineReminders(letter);
      }
    }

    setGuardando(false);
    // Tras guardar, volvemos directamente al listado principal: el usuario ya
    // ha visto el resumen en esta misma pantalla antes de pulsar "Guardar carta".
    navigation.navigate('Home');
  };

  const irABorrador = () => {
    navigation.navigate('Draft', { analysis });
  };

  const enviarFeedback = (valor) => {
    setFeedback(valor);
    if (valor === 'no') {
      Alert.alert(
        '¿Qué ha fallado?',
        'Gracias por avisarnos. Puedes revisar el texto original más abajo mientras mejoramos el resumen.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.orgRow}>
          <View style={[styles.dot, { backgroundColor: analysis.organismo.color }]} />
          <Text style={styles.organismo}>{analysis.organismo.nombre}</Text>
        </View>
        <Text style={styles.title}>{analysis.titulo}</Text>

        {analysis.fechaLimite && analysis.urgencia !== 'informativa' && (
          <View style={styles.deadlineBlock}>
            <DeadlineBadge urgencia={analysis.urgencia} fechaLimite={analysis.fechaLimite} />
            <Text style={styles.deadlineDate}>
              Fecha límite: {formatDateEs(analysis.fechaLimite)}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.audioBtn}
          onPress={alternarAudio}
          accessibilityRole="button"
          accessibilityLabel={hablando ? 'Detener lectura en voz alta' : 'Escuchar el resumen en voz alta'}
        >
          <Text style={styles.audioIcon}>{hablando ? '⏸' : '🔊'}</Text>
          <Text style={styles.audioText}>{hablando ? 'Detener lectura' : 'Escuchar resumen'}</Text>
        </TouchableOpacity>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>En palabras sencillas</Text>
          <Text style={styles.summaryText}>{analysis.resumenClaro}</Text>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionLabel}>Qué tienes que hacer</Text>
          <Text style={styles.actionText}>{analysis.accionRequerida}</Text>
        </View>

        <TrustBanner confianza={analysis.confianza} />

        <View style={styles.originalBlock}>
          <Text style={styles.originalLabel}>Fragmento del texto original</Text>
          <Text style={styles.originalText}>&ldquo;{analysis.fragmentoOriginal}&rdquo;</Text>
        </View>

        <View style={styles.feedbackBlock}>
          <Text style={styles.feedbackLabel}>¿Te ha quedado clara la carta?</Text>
          <View style={styles.feedbackRow}>
            <TouchableOpacity
              style={[styles.feedbackBtn, feedback === 'si' && styles.feedbackBtnActive]}
              onPress={() => enviarFeedback('si')}
            >
              <Text style={styles.feedbackText}>👍 Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feedbackBtn, feedback === 'no' && styles.feedbackBtnActiveNeg]}
              onPress={() => enviarFeedback('no')}
            >
              <Text style={styles.feedbackText}>👎 No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        {analysis.accionRequerida && !analysis.accionRequerida.toLowerCase().startsWith('ninguna') && (
          <TouchableOpacity style={styles.secondaryBtn} onPress={irABorrador}>
            <Text style={styles.secondaryBtnText}>Redactar respuesta</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.primaryBtn} onPress={guardarYContinuar} disabled={guardando}>
          <Text style={styles.primaryBtnText}>{guardando ? 'Guardando…' : 'Guardar carta'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ivory },
  scroll: { padding: 20, paddingBottom: 20 },
  orgRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  organismo: { ...typeScale.caption, color: colors.slate, fontFamily: 'AtkinsonHyperlegible_700Bold' },
  title: { ...typeScale.h1, color: colors.ink, marginBottom: 16 },
  deadlineBlock: { marginBottom: 16, gap: 6 },
  deadlineDate: { ...typeScale.caption, color: colors.slate },
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
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLabel: { ...typeScale.caption, color: colors.teal, fontFamily: 'AtkinsonHyperlegible_700Bold', marginBottom: 8 },
  summaryText: { ...typeScale.bodyLarge, color: colors.ink },
  actionCard: {
    backgroundColor: colors.amberLight,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  actionLabel: { ...typeScale.caption, color: colors.amberDark, fontFamily: 'AtkinsonHyperlegible_700Bold', marginBottom: 8 },
  actionText: { ...typeScale.bodyLarge, color: colors.ink },
  originalBlock: { marginTop: 18, marginBottom: 18 },
  originalLabel: { ...typeScale.caption, color: colors.slateLight, marginBottom: 6 },
  originalText: { ...typeScale.caption, color: colors.slate, fontStyle: 'italic', lineHeight: 20 },
  feedbackBlock: { marginBottom: 12 },
  feedbackLabel: { ...typeScale.body, color: colors.ink, marginBottom: 10 },
  feedbackRow: { flexDirection: 'row', gap: 12 },
  feedbackBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: colors.white,
  },
  feedbackBtnActive: { backgroundColor: colors.sageLight, borderColor: colors.sage },
  feedbackBtnActiveNeg: { backgroundColor: colors.coralLight, borderColor: colors.coral },
  feedbackText: { ...typeScale.body, color: colors.ink },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: colors.ivory,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  secondaryBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: { ...typeScale.bodyBold, color: colors.tealDark },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: { ...typeScale.bodyBold, color: colors.white },
});
