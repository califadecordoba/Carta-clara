/**
 * notificationService
 * -------------------
 * Recordatorios de plazo mediante notificaciones LOCALES (no push desde
 * servidor). Esto es lo que permitió resolver la contradicción detectada
 * en la revisión de spec: "sin cuenta" + "recordatorios" solo son
 * compatibles si los recordatorios se programan y disparan en el propio
 * dispositivo, sin backend de mensajería de por medio.
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('plazos', {
      name: 'Recordatorios de plazo',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  return finalStatus === 'granted';
}

/**
 * Programa recordatorios escalonados antes de una fecha límite:
 * 7 días antes, 2 días antes y el mismo día. Devuelve los IDs de
 * notificación programados para poder cancelarlos si la carta se
 * resuelve o se borra.
 */
export async function scheduleDeadlineReminders(letter) {
  if (!letter.fechaLimite) return [];

  const deadline = new Date(letter.fechaLimite);
  const now = new Date();
  const offsets = [
    { days: 7, etiqueta: 'en 7 días' },
    { days: 2, etiqueta: 'en 2 días' },
    { days: 0, etiqueta: 'hoy' },
  ];

  const ids = [];
  for (const offset of offsets) {
    const triggerDate = new Date(deadline);
    triggerDate.setDate(triggerDate.getDate() - offset.days);
    triggerDate.setHours(10, 0, 0, 0);

    if (triggerDate <= now) continue;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Plazo de ${letter.organismo?.nombre || 'tu carta'}`,
        body: `"${letter.titulo}" vence ${offset.etiqueta}. Toca para revisarla.`,
        data: { letterId: letter.id },
      },
      trigger: triggerDate,
    });
    ids.push(id);
  }
  return ids;
}

export async function cancelReminders(notificationIds = []) {
  for (const id of notificationIds) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}
