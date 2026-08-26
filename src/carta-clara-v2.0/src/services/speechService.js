/**
 * speechService
 * -------------
 * Lectura en voz alta del resumen en lenguaje sencillo, pensada para
 * usuarios con baja alfabetización o dificultades de lectura (requisito
 * de accesibilidad añadido en la revisión de spec).
 */

import * as Speech from 'expo-speech';

export function speak(text, { onStart, onDone, onError } = {}) {
  Speech.stop();
  Speech.speak(text, {
    language: 'es-ES',
    rate: 0.92,
    onStart,
    onDone,
    onError,
  });
}

export function stopSpeaking() {
  Speech.stop();
}

export async function isSpeaking() {
  return Speech.isSpeakingAsync();
}
