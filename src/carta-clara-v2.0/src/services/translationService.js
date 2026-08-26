/**
 * translationService
 * -------------------
 * Contrato único entre la UI y el "traductor" de cartas burocráticas.
 * Hoy implementado con un simulador (processLetterMock). El día que haya
 * backend real (OCR + LLM), solo hay que sustituir la función `processLetter`
 * exportada por una que llame al endpoint propio — la firma de entrada/salida
 * no cambia, así que ninguna pantalla necesita tocarse.
 *
 * Entrada esperada del backend real: { images: string[] (uris o base64) }
 * Salida esperada (contrato): ver `LetterAnalysisShape` más abajo.
 */

// Forma de los datos que cualquier implementación debe devolver.
// (documentación en JS, no TypeScript, para mantener el proyecto simple)
//
// LetterAnalysisShape = {
//   organismo: { nombre: string, color: string },
//   titulo: string,
//   fragmentoOriginal: string,
//   resumenClaro: string,
//   accionRequerida: string,
//   urgencia: 'urgente' | 'normal' | 'informativa',
//   fechaLimite: string | null, // ISO date
//   datosPersonalesDetectados: string[], // p.ej. ['DNI', 'nombre', 'dirección']
//   confianza: number, // 0-1, para el mecanismo de confianza en el resumen
// }

import { mockLetters } from '../data/mockLetters';

const RANDOM_SAMPLE_POOL = mockLetters;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simula el procesado de una carta a partir de fotos.
 * Introduce un retardo realista (3.5-5.5s) para que la pantalla de
 * "Procesando" tenga sentido, y devuelve un análisis coherente con el
 * contrato definido arriba, tomando como base uno de los ejemplos mock
 * (aleatorio) para que cada prueba se sienta distinta.
 *
 * @param {{ images: string[] }} input
 * @returns {Promise<object>} LetterAnalysisShape
 */
export async function processLetterMock({ images }) {
  if (!images || images.length === 0) {
    throw new Error('Se necesita al menos una imagen para procesar la carta.');
  }

  await delay(3500 + Math.random() * 2000);

  // Fallo simulado ocasional para probar el manejo de errores (5%)
  if (Math.random() < 0.05) {
    throw new Error(
      'No hemos podido leer bien la imagen. Prueba a hacer la foto con más luz y sin sombras.'
    );
  }

  const sample =
    RANDOM_SAMPLE_POOL[Math.floor(Math.random() * RANDOM_SAMPLE_POOL.length)];

  return {
    organismo: sample.organismo,
    titulo: sample.titulo,
    fragmentoOriginal: sample.fragmentoOriginal,
    resumenClaro: sample.resumenClaro,
    accionRequerida: sample.accionRequerida,
    urgencia: sample.urgencia,
    fechaLimite: sample.fechaLimite,
    datosPersonalesDetectados: ['nombre', 'DNI', 'dirección'],
    confianza: 0.86 + Math.random() * 0.1,
    paginas: images.length,
  };
}

/**
 * Punto de entrada único usado por la UI. Hoy delega en el simulador.
 * Sustituir esta función (o su cuerpo) por la llamada real es el único
 * cambio necesario para pasar a producción.
 */
export async function processLetter(input) {
  return processLetterMock(input);
}

/**
 * Genera un borrador de respuesta a partir del análisis de una carta.
 * En la versión real, esto llamaría a un LLM con instrucciones estrictas
 * de NO inventar datos personales, solo insertar marcadores editables
 * (ver FR sobre manejo de datos personales en borradores).
 */
export async function generateDraftMock(letterAnalysis) {
  await delay(1500 + Math.random() * 1000);

  return {
    cuerpo:
      `Estimados señores de {{ORGANISMO}}:\n\n` +
      `Mi nombre es {{NOMBRE_COMPLETO}}, con DNI {{DNI}}, y me dirijo a ustedes en relación con su escrito de referencia recibido con fecha {{FECHA_RECEPCION}}.\n\n` +
      `${letterAnalysis.accionRequerida ? `En relación con "${letterAnalysis.accionRequerida}", ` : ''}` +
      `adjunto la documentación solicitada y quedo a su disposición para cualquier aclaración adicional.\n\n` +
      `Atentamente,\n{{NOMBRE_COMPLETO}}\n{{DIRECCION}}`,
    marcadores: [
      { id: 'ORGANISMO', etiqueta: 'Organismo', valor: letterAnalysis.organismo?.nombre || '' },
      { id: 'NOMBRE_COMPLETO', etiqueta: 'Nombre completo', valor: '' },
      { id: 'DNI', etiqueta: 'DNI / NIE', valor: '' },
      { id: 'FECHA_RECEPCION', etiqueta: 'Fecha de recepción', valor: '' },
      { id: 'DIRECCION', etiqueta: 'Dirección', valor: '' },
    ],
  };
}
