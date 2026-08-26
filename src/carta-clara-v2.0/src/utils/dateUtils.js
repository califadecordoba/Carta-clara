const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function formatDateEs(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function daysUntil(isoString) {
  if (!isoString) return null;
  const target = new Date(isoString);
  target.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - now.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Traduce los días restantes a una etiqueta humana y determina si el
 * plazo ya expiró (cubre el caso "plazo caducado" añadido en la revisión).
 */
export function deadlineLabel(isoString) {
  const days = daysUntil(isoString);
  if (days === null) return { texto: 'Sin plazo', expirado: false };
  if (days < 0) {
    const vencidoHace = Math.abs(days);
    return {
      texto: vencidoHace === 1 ? 'Plazo vencido hace 1 día' : `Plazo vencido hace ${vencidoHace} días`,
      expirado: true,
    };
  }
  if (days === 0) return { texto: 'El plazo vence hoy', expirado: false };
  if (days === 1) return { texto: 'Queda 1 día', expirado: false };
  return { texto: `Quedan ${days} días`, expirado: false };
}
