# Tareas: Carta Clara — Traductor de Burocracia

**Basado en**: `plan-carta-clara.md`
**MVP**: Setup + Foundational + Historia 1 (P1) — ya es una demo mostrable por sí sola.
**Demo completa del reto**: todas las fases, hasta Historia 3 (P3).

Los IDs marcados con **[P]** pueden hacerse en paralelo dentro de su fase (tocan archivos/componentes distintos).

## Fase 1 — Setup

- **T001**: Crear la estructura base de la aplicación (single-page, mobile-first) y dejarla desplegable para el reto.
- **T002**: Configurar el acceso a la API del modelo de IA multimodal (clave, cliente básico reutilizable).
- **T003** [P]: Definir estilos base y layout general (tipografía grande, botones amplios, pensado para el público mayor).

## Fase 2 — Foundational (bloqueante para todas las historias)

- **T004**: Implementar el componente de subida de imagen (cámara/galería), reutilizable por US1, US2 y US3.
- **T005**: Implementar la llamada al modelo de IA con el prompt de clasificación + análisis (entrada: imagen; salida: documento oficial sí/no, organismo, asunto, requiere acción, plazo, resumen).
- **T006** [P]: Implementar la capa de persistencia local (guardar, leer, marcar resuelta, listar) que usarán US2 y US3.

**Checkpoint**: con Setup + Foundational listos, ya se puede conectar la Historia 1.

## Fase 3 — Historia de Usuario 1: Entender la carta (P1) 🎯 MVP

- **T007**: Implementar la pantalla de resultado que muestra el resumen en lenguaje sencillo, el organismo y si requiere acción (FR-002).
- **T008**: Destacar visualmente la fecha límite cuando exista (FR-003).
- **T009**: Manejar imagen ilegible: mensaje claro + invitación a repetir la foto (FR-004).
- **T010**: Manejar documento no reconocido como carta oficial, sin generar una explicación inventada (FR-005).

**Checkpoint**: la app ya resuelve el problema principal de forma independiente y es demostrable aunque no dé tiempo a nada más.

## Fase 4 — Historia de Usuario 2: Generar borrador de respuesta (P2)

- **T011**: Implementar el prompt de generación de borrador a partir del resumen estructurado (FR-006).
- **T012**: Implementar la pantalla de borrador editable por el usuario (FR-007).
- **T013**: Evitar ofrecer un borrador cuando la carta es solo informativa (FR-008).

**Checkpoint**: se puede probar generando un borrador a partir de un resumen ya existente, sin depender de guardado ni recordatorios.

## Fase 5 — Historia de Usuario 3: Guardar y recordar (P3)

- **T014**: Implementar la acción "Guardar carta" sin login, usando la capa de persistencia local (FR-009).
- **T015**: Implementar el listado de cartas guardadas con su estado (pendiente/resuelta) y plazo.
- **T016**: Implementar el cálculo y disparo de recordatorios en 7, 5, 3, 2 y 1 día antes del plazo (FR-010).
- **T017**: Implementar la acción "Marcar como resuelta", que detiene los recordatorios de esa carta (FR-011).
- **T018**: Implementar la expiración y borrado automático a los 30 días tras la consulta o el vencimiento del plazo (FR-012).

**Checkpoint**: demo end-to-end de las tres historias completas.

## Fase 6 — Pulido y demo

- **T019** [P]: Revisar accesibilidad — tamaños de fuente, contraste y botones grandes para el público objetivo (mayores).
- **T020** [P]: Probar manualmente los escenarios de aceptación de la spec, incluyendo los casos límite (foto borrosa, documento no oficial, carta ya vencida, carta sin plazo).
- **T021**: Preparar el guion de demo mostrando el flujo completo: subir carta → entender → generar borrador → guardar → ver recordatorio.

## Dependencias entre fases

Setup → Foundational → Historia 1 (MVP) → Historia 2 → Historia 3 → Pulido.

Si el tiempo del reto se agota, el orden garantiza que siempre hay algo demostrable: primero solo P1, luego P1+P2, luego la demo completa P1+P2+P3.
