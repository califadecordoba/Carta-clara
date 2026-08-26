// Datos de ejemplo que reproducen las 6 cartas del prototipo original:
// Hacienda (requerimiento, pendiente), Ayuntamiento (multa, urgente 2 días),
// Seguridad Social (vida laboral, pendiente), Banco (informativa),
// Hacienda (devolución, resuelta), Seguridad Social (cita previa, resuelta).

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const ORGANISMOS = {
  hacienda: { nombre: 'Agencia Tributaria (Hacienda)', color: '#2F6F6B' },
  ayuntamiento: { nombre: 'Ayuntamiento', color: '#C98A2C' },
  seguridadSocial: { nombre: 'Seguridad Social', color: '#5C8A5C' },
  banco: { nombre: 'Banco', color: '#5B5548' },
};

export const mockLetters = [
  {
    id: 'letter-001',
    organismo: ORGANISMOS.hacienda,
    titulo: 'Requerimiento de justificante',
    resumenCorto: 'Piden que envíes un justificante de gastos antes del plazo.',
    estado: 'pendiente',
    leida: true,
    urgencia: 'normal',
    fechaRecepcion: daysFromNow(-3),
    fechaLimite: daysFromNow(12),
    fragmentoOriginal:
      'Se requiere al obligado tributario para que aporte, en el plazo de 10 días hábiles, justificante...',
    resumenClaro:
      'Hacienda te pide que envíes un documento que demuestre un gasto que declaraste. Tienes 10 días hábiles desde que recibiste esta carta. Si no lo envías a tiempo, pueden abrir un expediente sancionador.',
    accionRequerida: 'Enviar justificante de gasto',
    paginas: 2,
    tieneAudio: true,
  },
  {
    id: 'letter-002',
    organismo: ORGANISMOS.ayuntamiento,
    titulo: 'Alegación a multa de tráfico',
    resumenCorto: 'Puedes alegar contra la multa, pero quedan solo 2 días.',
    estado: 'pendiente',
    leida: true,
    urgencia: 'urgente',
    fechaRecepcion: daysFromNow(-18),
    fechaLimite: daysFromNow(2),
    fragmentoOriginal:
      'Contra la presente resolución podrá interponer recurso de alegaciones en el plazo de veinte días naturales...',
    resumenClaro:
      'Te han puesto una multa. Puedes presentar alegaciones (explicar por qué no estás de acuerdo) pero el plazo termina muy pronto: en 2 días. Si no haces nada, la multa se dará por aceptada.',
    accionRequerida: 'Presentar alegación o pagar la multa',
    paginas: 1,
    tieneAudio: true,
  },
  {
    id: 'letter-003',
    organismo: ORGANISMOS.seguridadSocial,
    titulo: 'Justificante de vida laboral',
    resumenCorto: 'Solicitud de tu informe de vida laboral, sin urgencia.',
    estado: 'pendiente',
    leida: true,
    urgencia: 'normal',
    fechaRecepcion: daysFromNow(-1),
    fechaLimite: daysFromNow(30),
    fragmentoOriginal:
      'Se le informa que puede solicitar su informe de vida laboral a efectos de acreditar periodos cotizados...',
    resumenClaro:
      'Es un aviso informativo: puedes pedir tu informe de vida laboral (el historial de tus cotizaciones) si lo necesitas para algún trámite. No es obligatorio que hagas nada, pero puede serte útil guardarlo.',
    accionRequerida: 'Ninguna obligatoria (solicitud opcional)',
    paginas: 1,
    tieneAudio: true,
  },
  {
    id: 'letter-004',
    organismo: ORGANISMOS.banco,
    titulo: 'Cambio de condiciones de la cuenta',
    resumenCorto: 'El banco informa de nuevas condiciones. Solo informativa.',
    estado: 'informativa',
    leida: true,
    urgencia: 'informativa',
    fechaRecepcion: daysFromNow(-5),
    fechaLimite: null,
    fragmentoOriginal:
      'Le informamos de la modificación de las condiciones contractuales aplicables a su cuenta a partir del...',
    resumenClaro:
      'El banco te avisa de que van a cambiar algunas condiciones de tu cuenta (comisiones o intereses). Es solo información: no tienes que responder ni hacer ningún trámite, pero conviene que la leas.',
    accionRequerida: 'Ninguna. Solo informativa.',
    paginas: 3,
    tieneAudio: true,
  },
  {
    id: 'letter-005',
    organismo: ORGANISMOS.hacienda,
    titulo: 'Devolución de la renta',
    resumenCorto: 'Tu devolución de la renta ya se ha ingresado.',
    estado: 'resuelta',
    leida: true,
    urgencia: 'resuelta',
    fechaRecepcion: daysFromNow(-40),
    fechaLimite: daysFromNow(-40),
    fragmentoOriginal:
      'Se ha procedido a la transferencia del importe correspondiente a la devolución solicitada en su declaración...',
    resumenClaro:
      'Buenas noticias: Hacienda ya te ha ingresado la devolución de tu declaración de la renta. No tienes que hacer nada más con esta carta.',
    accionRequerida: 'Ninguna. Trámite completado.',
    paginas: 1,
    tieneAudio: true,
  },
  {
    id: 'letter-006',
    organismo: ORGANISMOS.seguridadSocial,
    titulo: 'Confirmación de cita previa',
    resumenCorto: 'Tu cita previa ya pasó. Trámite finalizado.',
    estado: 'resuelta',
    leida: true,
    urgencia: 'resuelta',
    fechaRecepcion: daysFromNow(-60),
    fechaLimite: daysFromNow(-55),
    fragmentoOriginal:
      'Se le confirma la cita previa solicitada para el trámite de solicitud de pensión...',
    resumenClaro:
      'Esta carta confirmaba una cita que ya tuviste en la Seguridad Social. El trámite de esa cita ya se completó, así que puedes archivar esta carta.',
    accionRequerida: 'Ninguna. Cita ya realizada.',
    paginas: 1,
    tieneAudio: true,
  },
];

export function getLetterById(id) {
  return mockLetters.find((l) => l.id === id) || null;
}
