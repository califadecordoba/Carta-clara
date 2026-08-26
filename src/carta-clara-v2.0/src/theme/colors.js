// Paleta de Carta Clara
// Cálida (marfil), pensada para público mayor con baja alfabetización digital.
// Contraste alto, sin colores fríos o clínicos.

export const colors = {
  // Fondo base
  ivory: '#FBF7EF',
  ivoryDeep: '#F3EBDA',
  white: '#FFFFFF',

  // Verde-azulado: confianza, elementos institucionales, acciones primarias
  teal: '#2F6F6B',
  tealDark: '#1F4B48',
  tealLight: '#E4EFEE',
  tealSoft: '#CFE3E1',

  // Ámbar: plazo normal / atención moderada
  amber: '#C98A2C',
  amberDark: '#8F621C',
  amberLight: '#FBECD3',

  // Coral: plazo urgente / atención alta
  coral: '#D9634B',
  coralDark: '#A8412D',
  coralLight: '#FBE1DB',

  // Estados informativos / neutros
  slate: '#5B5548',
  slateLight: '#8A8375',
  ink: '#2B2820',
  border: '#E4DCC8',

  // Éxito (carta resuelta)
  sage: '#5C8A5C',
  sageLight: '#E6EFE2',

  // Superficie de tarjeta
  cardShadow: 'rgba(43, 40, 32, 0.08)',

  // Carta no leída (destaca en el listado principal frente a las ya leídas)
  unreadBg: '#E4EFEE',
  unreadBorder: '#2F6F6B',
};

// Mapea el estado de una carta al color de acento correspondiente
export function getUrgencyColor(urgency) {
  switch (urgency) {
    case 'urgente':
      return { bg: colors.coralLight, fg: colors.coralDark, accent: colors.coral };
    case 'normal':
      return { bg: colors.amberLight, fg: colors.amberDark, accent: colors.amber };
    case 'informativa':
      return { bg: colors.tealLight, fg: colors.tealDark, accent: colors.teal };
    case 'resuelta':
      return { bg: colors.sageLight, fg: colors.tealDark, accent: colors.sage };
    default:
      return { bg: colors.ivoryDeep, fg: colors.slate, accent: colors.slateLight };
  }
}
