# Carta Clara — Traductor de Burocracia

Reto de vibecoding con SDD (Spec-Driven Development).

## El problema

Cartas de Hacienda, la Seguridad Social o el banco están escritas en un lenguaje que angustia a mucha gente — especialmente a personas mayores, migrantes o con baja alfabetización — que no entienden qué les piden ni el plazo que tienen para responder, y acaban dependiendo de un familiar o de terceros para descifrarlas.

## La solución

Una app en la que basta con subir una foto de la carta oficial. La IA:

1. **Explica en lenguaje sencillo** de qué organismo viene, qué dice y si hay que hacer algo (Historia 1 — MVP).
2. **Genera un borrador de respuesta o solicitud**, editable, cuando la carta lo requiere (Historia 2).
3. **Guarda la carta y avisa antes del plazo** (recordatorios a 7, 5, 3, 2 y 1 día), sin necesidad de crear cuenta ni iniciar sesión (Historia 3).

No sustituye asesoría legal o fiscal: es una ayuda para entender y no perder plazos.

## Público objetivo

Personas mayores, migrantes y cualquiera que se sienta perdido ante un documento administrativo — sin login ni curva de aprendizaje.

## Estado del proyecto

Este repositorio contiene, de momento, la documentación de diseño siguiendo la metodología SDD (Spec-Driven Development), previa a la implementación:

| Archivo | Contenido |
|---|---|
| [`spec-carta-clara.md`](./spec-carta-clara.md) | Especificación funcional: historias de usuario priorizadas, requisitos, criterios de éxito y suposiciones |
| [`plan-carta-clara.md`](./plan-carta-clara.md) | Plan técnico: arquitectura, decisiones de diseño y riesgos |
| [`tasks-carta-clara.md`](./tasks-carta-clara.md) | Desglose de tareas de implementación, organizadas por historia de usuario |

**Alcance de la demo:** las tres historias (P1 + P2 + P3) completas. El orden de construcción (Setup → Foundational → Historia 1 → Historia 2 → Historia 3) garantiza que siempre hay algo demostrable aunque el tiempo del reto se agote antes de terminar todo.

## Decisiones clave de diseño

- **Sin cuentas ni login**, pensado para el público mayor al que se dirige.
- **Sin backend propio en esta fase**: la app llama directamente a un modelo de IA multimodal (visión + texto) y persiste los datos en el propio dispositivo del usuario.
- **Retención de datos limitada**: las cartas guardadas se borran automáticamente a los 30 días de la consulta o de expirar el plazo.
- Fuera de alcance por ahora (valorable en fases futuras): envío automático de la respuesta al organismo, trámites con firma digital/Cl@ve, y un sistema de cuentas.

## Categoría

Acción Social / Inclusión.
