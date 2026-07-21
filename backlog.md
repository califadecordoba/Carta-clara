# Backlog de mejoras — Carta Clara (post-demo del reto)

Recopila lo que ha ido quedando marcado como "fuera de alcance", "riesgo" o "hueco" en la spec, el plan y el mapa de historias, más la mejora de confianza discutida después de la demo. No es una re-priorización formal (eso toca cuando se sepa qué feedback da el jurado), pero da un punto de partida ordenado.

## Prioridad alta

| # | Mejora | Por qué ahora | Origen |
|---|---|---|---|
| 1 | **Mecanismo de confianza en la explicación generada**: citar el fragmento literal de la carta que respalda cada dato (organismo, plazo, acción), validar la fecha extraída de forma determinista, y usar una segunda pasada de IA solo como desempate cuando haya dudas — nunca como "sello" definitivo. | Es el riesgo más directo para la credibilidad del producto: una explicación incorrecta puede llevar a perder un plazo real. | Discusión post-mapa de historias |
| 2 | **Recordatorios más fiables**: hoy dependen de notificaciones locales del navegador sin backend, lo que el propio plan técnico señala como "mejor esfuerzo" y no garantizado si el usuario no abre la app. | Si el recordatorio no llega, se rompe la promesa central de la Historia 3. | Riesgo ya identificado en `plan-carta-clara.md` |
| 3 | **Manejo de cartas con varias páginas o varios asuntos distintos** en un mismo documento. | Caso límite señalado en la spec y sin resolver; es plausible que ocurra con frecuencia real (notificaciones de Hacienda a menudo traen anexos). | Caso límite de `spec-carta-clara.md` |

## Prioridad media

| # | Mejora | Por qué | Origen |
|---|---|---|---|
| 4 | **Compartir la carta o el borrador con un familiar** (modo solo lectura, sin que pueda editar lo del usuario). | El público objetivo (mayores) a menudo quiere una segunda opinión de un hijo o cuidador antes de enviar algo oficial. | Hueco detectado en `mapa-historias-carta-clara.md` |
| 5 | **Cuenta opcional** para no perder el historial de cartas al cambiar de dispositivo o borrar caché, sin volver obligatorio el login. | Ya quedó marcado en la spec como "fuera de alcance en esta fase, valorable en fases futuras". | `spec-carta-clara.md` — Fuera de alcance |
| 6 | **Integración con el catálogo de trámites del Equipo 5**: cuando una carta pida completar un trámite (ej. "presenta el justificante X"), derivar a su checklist en vez de dejar al usuario colgado. | Es la complementariedad que ya se planteó frente a su producto; convierte una posible superposición en una alianza. | Análisis comparativo con el producto del Equipo 5 |

## Prioridad baja

| # | Mejora | Por qué | Origen |
|---|---|---|---|
| 7 | **Soporte multi-idioma** más allá del español, para el colectivo migrante que también es público objetivo. | Hoy limitado a español por decisión explícita para la demo. | `spec-carta-clara.md` (FR-013) |
| 8 | **Refuerzo de protección de datos**: cifrado de las imágenes guardadas y opción de borrado inmediato a petición del usuario, más allá del borrado automático a 30 días. | Extiende la garantía ya dada en la spec (retención de 30 días) a un control más explícito del usuario sobre sus propios datos sensibles. | Extensión de FR-012 |
| 9 | **Lectura en voz alta del resumen** (texto a voz), para usuarios con dificultad de lectura en pantalla. | Encaja de forma natural con el público mayor objetivo, aunque no se había planteado antes. | Propuesta nueva — sin evidencia de usuario todavía |

## Nota

Los ítems 1, 2 y 3 tocan directamente la fiabilidad de lo que ya se demuestra en el reto; los del bloque medio amplían el alcance sin tocar lo ya construido; los de baja prioridad son ampliaciones de calidad de vida o de alcance de público, no bloqueantes para ninguna historia actual.
