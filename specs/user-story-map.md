# Mapa de historias: Carta Clara — Traductor de Burocracia

**Segmento**: personas mayores, migrantes o con baja alfabetización que reciben cartas administrativas (Hacienda, Seguridad Social, banco) y no tienen a alguien cerca que se las traduzca cada vez.

**Persona**: Antonio, 74 años, vive solo, recibe cartas de organismos oficiales con cierta frecuencia y depende de que su hija le llame para explicárselas. `[SUPOSICIÓN: persona ilustrativa construida a partir de los usuarios descritos en la spec — no hay entrevistas de usuario todavía]`

**Narrativa (JTBD)**: "Entender qué me pide una carta oficial y resolverlo a tiempo, sin depender de otra persona."

## Columna vertebral → pasos → tareas (por release)

### Actividad 1: Subir la carta
Pasos: hacer una foto de la carta · subirla a la app · comprobar que se ha leído bien

- **MVP**: capturar o subir la imagen del documento (FR-001) · avisar y pedir repetir la foto si sale borrosa/ilegible (FR-004) · avisar cuando el documento no parece una carta oficial (FR-005)
- **R2**: —
- **Futuro**: soportar cartas en más idiomas además de español (ampliación de FR-013, hoy limitado a español)

### Actividad 2: Entender la carta
Pasos: leer el resumen en lenguaje sencillo · identificar quién la envía y qué pide · ver si hay un plazo

- **MVP**: generar el resumen (organismo, asunto, si requiere acción) (FR-002) · destacar la fecha límite si existe (FR-003) · indicar cuando la carta es solo informativa (FR-008)
- **R2**: —
- **Futuro**: traducir el resumen a otros idiomas para el colectivo migrante

### Actividad 3: Responder si hace falta
Pasos: pedir un borrador de respuesta · revisar y editar el texto · enviarlo por sus propios medios

- **MVP**: generar el borrador de respuesta/solicitud (FR-006) · permitir editar el borrador antes de darlo por bueno (FR-007)
- **R2**: —
- **Futuro**: envío asistido a la sede electrónica del organismo (hoy explícitamente fuera de alcance en la spec, junto con trámites que requieran Cl@ve/firma digital)

### Actividad 4: Hacer seguimiento hasta resolverlo
Pasos: guardar la carta · recibir avisos antes de que venza el plazo · marcarla como resuelta

- **MVP**: guardar la carta sin necesidad de cuenta ni login (FR-009) · recordatorios en 7, 5, 3, 2 y 1 día antes del plazo (FR-010) · marcar como resuelta para dejar de recibir avisos (FR-011) · borrado automático a los 30 días de la consulta o la expiración (FR-012)
- **R2**: —
- **Futuro**: cuenta opcional para no perder el historial al cambiar de dispositivo (la spec deja el "sin login" fijado para esta fase, pero marcado como valorable más adelante)

## Huecos y oportunidades

- **Sin mecanismo de confianza sobre lo que dice la IA.** El plan técnico ya señala el riesgo de fiabilidad del análisis; no hay hoy un equivalente al "sello de verificado" que sí tiene el producto del Equipo 5. Es una oportunidad de Release 2 para reforzar confianza en el resumen y el borrador generados.
- **No hay forma de compartir la carta o el borrador con un familiar.** Marta (persona del Equipo 5) comparte su checklist con su pareja o su madre; Antonio no tiene un equivalente para pedir una segunda opinión sin reenviar capturas de pantalla por WhatsApp. Encaja como Release 2.
- **El "walking skeleton" ya cruza las cuatro actividades en el MVP** (subir → entender → responder → seguir), que es justo lo que se acordó como demo completa del reto: ninguna actividad se queda coja, aunque el resto de fases del proyecto (login, envío automático, multi-idioma) queden fuera de esta rebanada.
- **Punto de conexión con el producto del Equipo 5**: si una carta pide "presenta el justificante X", hoy Carta Clara no tiene dónde derivar esa gestión — encajaría como una actividad futura de "resolver el trámite derivado" apoyada en su catálogo.
