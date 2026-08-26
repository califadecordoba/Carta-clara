// Atkinson Hyperlegible: cuerpo de texto -> diseñada para baja visión, alta
//   distinción entre caracteres similares (Il1, O0).
// Fraunces: titulares -> calidez editorial, contrapunto humano a un tema
//   burocrático y frío.

export const fontFamilies = {
  body: 'AtkinsonHyperlegible_400Regular',
  bodyBold: 'AtkinsonHyperlegible_700Bold',
  heading: 'Fraunces_600SemiBold',
  headingLight: 'Fraunces_400Regular_Italic',
};

export const typeScale = {
  display: { fontSize: 28, lineHeight: 34, fontFamily: fontFamilies.heading },
  h1: { fontSize: 24, lineHeight: 30, fontFamily: fontFamilies.heading },
  h2: { fontSize: 19, lineHeight: 25, fontFamily: fontFamilies.heading },
  bodyLarge: { fontSize: 18, lineHeight: 27, fontFamily: fontFamilies.body },
  body: { fontSize: 16, lineHeight: 24, fontFamily: fontFamilies.body },
  bodyBold: { fontSize: 16, lineHeight: 24, fontFamily: fontFamilies.bodyBold },
  caption: { fontSize: 14, lineHeight: 20, fontFamily: fontFamilies.body },
  small: { fontSize: 12, lineHeight: 16, fontFamily: fontFamilies.body },
};

// Escala de accesibilidad: multiplicador aplicado cuando el usuario activa
// "texto grande" en Ajustes (FR-021, ver requisitos de accesibilidad)
export const accessibilityScale = {
  normal: 1,
  large: 1.2,
  extraLarge: 1.4,
};
