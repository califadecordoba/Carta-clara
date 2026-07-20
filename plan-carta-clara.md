# Plan Técnico: Carta Clara — Traductor de Burocracia

**Basado en**: `spec-carta-clara.md`
**Estado**: Borrador para el reto de vibecoding
**Alcance de esta demo**: Historias 1, 2 y 3 completas (P1 + P2 + P3)

## Contexto técnico

- **Objetivo**: demo funcional en el tiempo del reto, priorizando velocidad de construcción sobre robustez de producción.
- **Plataforma**: aplicación web responsive, mobile-first (el caso de uso principal es fotografiar una carta con el móvil).
- **Sin cuentas/login**: requisito explícito de la spec (FR-009). El estado del usuario (cartas guardadas, recordatorios) se persiste en el propio dispositivo/navegador, no en un backend con usuarios.
- **Modelo de IA**: un único modelo multimodal (visión + texto) que recibe la imagen de la carta y devuelve, en la misma llamada o en llamadas encadenadas, la clasificación del documento, el resumen en lenguaje sencillo y (bajo demanda) el borrador de respuesta.
- **Recordatorios**: al no existir backend ni login, se implementan como notificaciones locales al navegador, programadas en el propio dispositivo. Como respaldo (ver Riesgos), la app muestra también un resumen de "pendientes" cada vez que se abre.
- **Persistencia**: almacenamiento local del navegador (tipo IndexedDB/localStorage) para guardar imagen, resumen, borrador y fecha límite, con borrado automático a los 30 días tras la consulta o la expiración del plazo (FR-012).

## Decisiones de arquitectura y por qué

1. **Sin backend propio en esta fase.** Reduce drásticamente el tiempo de construcción durante el reto y es coherente con el requisito de "sin login". Toda la lógica vive en el cliente más llamadas directas a la API de IA.
2. **Flujo lineal único** (subir → analizar → ver resultado → [guardar] → [generar borrador]) en vez de una navegación compleja, para maximizar lo que es fácilmente vibe-codeable en el tiempo disponible.
3. **La validación de imagen** (borrosa / no es una carta oficial) se resuelve pidiendo al propio modelo de IA que clasifique el documento como parte del mismo prompt de análisis, evitando construir lógica de visión por computador aparte.
4. **Los recordatorios se tratan como "mejor esfuerzo".** Sin backend no se puede garantizar el disparo de una notificación días después si el usuario no abre la app; por eso el diseño no depende solo de la notificación push sino que refuerza con un aviso visible al entrar.

## Estructura de proyecto (alto nivel)

- `app/upload/` — captura y subida de imagen (US1)
- `app/summary/` — visualización de la explicación, organismo, asunto y plazo (US1)
- `app/draft/` — generación y edición del borrador de respuesta (US2)
- `app/saved/` — listado de cartas guardadas, su estado y plazos (US3)
- `lib/ai/` — integración con el modelo de IA: prompt de clasificación+análisis, prompt de generación de borrador
- `lib/storage/` — capa de persistencia local: guardar, leer, marcar como resuelta, expirar/borrar
- `lib/reminders/` — cálculo de fechas de aviso (7/5/3/2/1 día) y disparo de notificaciones locales

## Fases

**Fase 0 — Decisiones a validar antes de construir:**
- Confirmar que las notificaciones locales del navegador son suficientes para el reto, o si se sustituyen enteramente por el aviso "pendientes" al abrir la app (más simple y más fiable para una demo corta).

**Fase 1 — Diseño de contratos (sin código todavía):**
- Contrato de "carta guardada": id local, imagen, resumen estructurado (organismo, asunto, requiere_accion, plazo), borrador (si existe), estado (pendiente/resuelta), fecha de creación.
- Contrato del prompt de análisis: entrada = imagen; salida = { es_documento_oficial, organismo, asunto, requiere_accion, plazo, resumen_en_lenguaje_sencillo }.
- Contrato del prompt de borrador: entrada = resumen estructurado + tipo de acción requerida; salida = texto formal (encabezado, cuerpo, cierre).

**Fase 2 — Implementación por historia de usuario:** ver `tasks-carta-clara.md`.

## Riesgos y mitigaciones

- **Fiabilidad de lectura con fotos de mala calidad** → mitigado por FR-004 (detectar y pedir repetir la foto).
- **Recordatorios sin backend pueden no dispararse de forma fiable** → mitigado mostrando también los "pendientes" al abrir la app, sin depender solo de la notificación.
- **Sin login implica pérdida de historial si se cambia de dispositivo o se borra caché** → asunción aceptada explícitamente para esta fase (ya documentada en la spec).
- **Tiempo limitado del reto** → el orden de construcción prioriza que la demo funcione end-to-end con P1 primero, para no quedarse sin nada mostrable si falta tiempo para P2/P3.
