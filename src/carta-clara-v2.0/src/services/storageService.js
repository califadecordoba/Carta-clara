/**
 * storageService
 * --------------
 * Persistencia local con AsyncStorage. Carta Clara no requiere cuenta
 * (decisión de producto validada en la revisión de spec), así que todos
 * los datos viven únicamente en el dispositivo del usuario. Esto es lo
 * que hace posibles los recordatorios (FR sobre notificaciones locales)
 * sin necesitar login ni servidor de usuarios.
 *
 * Cubre también el borrado manual explícito (FR-0XX: el usuario puede
 * eliminar cualquier carta y sus datos asociados en cualquier momento).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_LETTERS = '@carta_clara/letters';
const KEY_SETTINGS = '@carta_clara/settings';

export async function getAllLetters() {
  try {
    const raw = await AsyncStorage.getItem(KEY_LETTERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('storageService.getAllLetters error', e);
    return [];
  }
}

export async function saveLetter(letter) {
  const letters = await getAllLetters();
  const idx = letters.findIndex((l) => l.id === letter.id);
  if (idx >= 0) {
    letters[idx] = letter;
  } else {
    letters.unshift(letter);
  }
  await AsyncStorage.setItem(KEY_LETTERS, JSON.stringify(letters));
  return letter;
}

export async function getLetter(id) {
  const letters = await getAllLetters();
  return letters.find((l) => l.id === id) || null;
}

/**
 * Borrado manual explícito. Elimina la carta y todo lo asociado (fotos,
 * borrador, recordatorios). No hay borrado automático por antigüedad:
 * la decisión de retención es siempre del usuario.
 */
export async function deleteLetter(id) {
  const letters = await getAllLetters();
  const filtered = letters.filter((l) => l.id !== id);
  await AsyncStorage.setItem(KEY_LETTERS, JSON.stringify(filtered));
}

export async function deleteAllData() {
  await AsyncStorage.multiRemove([KEY_LETTERS, KEY_SETTINGS]);
}

export async function getSettings() {
  try {
    const raw = await AsyncStorage.getItem(KEY_SETTINGS);
    return raw
      ? JSON.parse(raw)
      : { textoGrande: false, recordatoriosActivos: true };
  } catch (e) {
    return { textoGrande: false, recordatoriosActivos: true };
  }
}

export async function saveSettings(settings) {
  await AsyncStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
}
