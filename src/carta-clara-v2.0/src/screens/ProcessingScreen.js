import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, SafeAreaView } from 'react-native';
import { colors } from '../theme/colors';
import { typeScale } from '../theme/typography';
import { processLetter } from '../services/translationService';

const PASOS = [
  'Leyendo el documento…',
  'Identificando el organismo…',
  'Buscando fechas y plazos…',
  'Traduciendo a lenguaje sencillo…',
];

export default function ProcessingScreen({ route, navigation }) {
  const { images } = route.params;
  const [pasoActual, setPasoActual] = useState(0);
  const [error, setError] = useState(null);
  const pulseAnim = useRef(new Animated.Value(0.6)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 1800, easing: Easing.linear, useNativeDriver: true })
    ).start();

    const stepInterval = setInterval(() => {
      setPasoActual((prev) => (prev < PASOS.length - 1 ? prev + 1 : prev));
    }, 1100);

    processLetter({ images })
      .then((analysis) => {
        clearInterval(stepInterval);
        navigation.replace('Summary', { analysis, images });
      })
      .catch((err) => {
        clearInterval(stepInterval);
        setError(err.message || 'No se ha podido procesar la carta.');
      });

    return () => clearInterval(stepInterval);
  }, []);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>No hemos podido leer la carta</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryHint} onPress={() => navigation.goBack()}>
            Volver a intentarlo
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]} />
        <Animated.Text style={[styles.icon, { opacity: pulseAnim }]}>📄</Animated.Text>
        <Text style={styles.title}>Traduciendo tu carta</Text>
        <Text style={styles.step}>{PASOS[pasoActual]}</Text>

        <View style={styles.dots}>
          {PASOS.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, idx <= pasoActual ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ivory },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  ring: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: colors.tealSoft,
    borderTopColor: colors.teal,
  },
  icon: { fontSize: 56, marginBottom: 24 },
  title: { ...typeScale.h1, color: colors.ink, marginBottom: 8, textAlign: 'center' },
  step: { ...typeScale.body, color: colors.slate, textAlign: 'center', marginBottom: 24 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: colors.teal },
  dotInactive: { backgroundColor: colors.tealSoft },
  errorIcon: { fontSize: 48, marginBottom: 16 },
  errorTitle: { ...typeScale.h2, color: colors.coralDark, marginBottom: 8, textAlign: 'center' },
  errorText: { ...typeScale.body, color: colors.slate, textAlign: 'center', marginBottom: 20 },
  retryHint: { ...typeScale.bodyBold, color: colors.teal, textDecorationLine: 'underline' },
});
