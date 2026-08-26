# Carta Clara

App móvil (React Native + Expo) que traduce cartas burocráticas españolas
(Hacienda, Seguridad Social, Ayuntamiento, bancos) a lenguaje sencillo,
con seguimiento de plazos, recordatorios y ayuda para redactar respuestas.

## Cómo arrancarla

```bash
npm install
npx expo start
```

Escanea el código QR con la app **Expo Go** (iOS/Android) o pulsa `w` para
abrirla en el navegador.

## Estructura

```
App.js                        Punto de entrada, carga de fuentes
src/
  theme/                      colors.js, typography.js — sistema de diseño
  navigation/AppNavigator.js  Pila de navegación de las 6 pantallas
  screens/
    HomeScreen.js             Lista de cartas
    UploadScreen.js           Captura de foto(s), multi-página
    ProcessingScreen.js       Animación de "traducción"
    SummaryScreen.js          Resumen, plazo, audio, feedback
    DraftScreen.js            Borrador editable con marcadores
    LetterDetailScreen.js     Detalle guardado + línea de tiempo de avisos
  components/                 LetterCard, DeadlineBadge, TrustBanner, PlaceholderChip
  services/
    translationService.js     Interfaz IA — hoy simulada, swap-in para backend real
    storageService.js         Persistencia local (AsyncStorage), sin cuenta
    notificationService.js    Recordatorios locales (sin servidor push)
    speechService.js          Lectura en voz alta (expo-speech)
  data/mockLetters.js         6 cartas de ejemplo
  utils/dateUtils.js          Formato de fechas y cálculo de plazos
```

## Decisiones de arquitectura ligadas a la revisión de spec

- **Sin cuenta, pero con recordatorios**: se resuelve con notificaciones
  *locales* (`expo-notifications`, programadas en el dispositivo) en vez de
  push desde servidor. Todos los datos viven en `AsyncStorage`, solo en el
  teléfono del usuario.
- **Borrado manual explícito**: `storageService.deleteLetter` y el botón
  "Eliminar esta carta" en el detalle. No hay borrado automático por
  antigüedad — la retención es siempre decisión del usuario.
- **Datos personales en borradores**: `PlaceholderChip` nunca autocompleta
  con datos inventados. El LLM (real o simulado) solo genera la estructura
  del texto con marcadores `{{...}}`; el usuario rellena cada dato a mano.
- **Multi-página**: `UploadScreen` permite añadir varias fotos antes de
  enviar a procesar (una carta puede llegar en 2+ páginas).
- **Plazos vencidos**: `LetterDetailScreen` detecta si `fechaLimite` ya
  pasó y muestra un aviso distinto en vez de tratarlo como un plazo normal.
- **Accesibilidad**: tipografía Atkinson Hyperlegible, botón de audio en
  cada carta (`speechService` + `expo-speech`), `accessibilityLabel` en
  los controles principales, paleta de alto contraste.
- **Mecanismo de confianza**: `TrustBanner` deja explícito que el resumen
  no es un documento oficial ni asesoramiento legal, y muestra el nivel
  de confianza del análisis.

## De simulado a real

Toda la lógica de IA pasa por `src/services/translationService.js`.
Para conectar un backend real (OCR + LLM):

1. Sustituye el cuerpo de `processLetter()` por una llamada `fetch` a tu
   endpoint, manteniendo la misma forma de entrada/salida documentada en
   el propio fichero (`LetterAnalysisShape`).
2. Haz lo mismo con `generateDraftMock()` para la generación de borradores.
3. Ninguna pantalla necesita cambios: consumen ambas funciones por su
   contrato, no por su implementación.

Antes de ese paso, ten en cuenta los riesgos de privacidad ya señalados en
la revisión de la spec: los documentos que se suben son datos oficiales
sensibles de población potencialmente vulnerable. Cualquier envío a un
servicio externo (OCR, LLM en la nube) necesita base legal clara, política
de retención definida y aviso explícito al usuario antes de subir la
primera foto.

## Pendiente de esta versión

- Almacenamiento cifrado de imágenes (hoy solo se guardan las URIs locales
  del picker; falta cifrado en reposo antes de producción).
- Pantalla de ajustes (texto grande, activar/desactivar recordatorios) —
  `storageService.getSettings`/`saveSettings` ya está listo, falta la UI.
- Tests automatizados.
