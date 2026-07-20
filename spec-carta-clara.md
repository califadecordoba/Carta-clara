# Especificación de Feature: Carta Clara — Traductor de Burocracia

**Rama**: `001-carta-clara`
**Creada**: 2026-07-20
**Estado**: Aclaraciones resueltas
**Input**: Descripción del usuario: "App donde subes una foto de una carta o documento oficial (Hacienda, Seguridad Social, banco...) y la IA explica en lenguaje sencillo qué significa, qué hay que hacer y el plazo, y genera un borrador de respuesta si aplica."

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de Usuario 1 - Entender una carta oficial en lenguaje sencillo (Prioridad: P1)

Como persona mayor, migrante o con baja alfabetización que recibe una carta administrativa que no entiende, quiero subir una foto del documento y recibir una explicación clara de qué dice, para saber si me afecta y qué se espera de mí sin depender de otra persona.

**Por qué esta prioridad**: es el núcleo de la propuesta de valor. Sin esta capacidad no hay producto; todo lo demás (borrador de respuesta, recordatorios) se apoya en esta explicación.

**Test independiente**: se puede probar subiendo la foto de una carta real y verificando que el resumen generado es fiel al contenido, sin necesidad de las demás historias.

**Escenarios de aceptación**:
1. **Dado** que tengo la foto de una carta oficial legible, **Cuando** la subo a la app, **Entonces** recibo un resumen en lenguaje sencillo (3-4 frases) que indica de qué organismo viene, qué me comunica y si requiere alguna acción por mi parte.
2. **Dado** que la carta indica una fecha límite o plazo, **Cuando** se genera el resumen, **Entonces** el plazo aparece destacado de forma explícita y en un formato de fecha claro.
3. **Dado** que subo una imagen borrosa o ilegible, **Cuando** el sistema intenta procesarla, **Entonces** se me informa de que no se ha podido leer y se me pide repetir la foto con indicaciones de cómo mejorarla.
4. **Dado** que subo un documento que no es una carta oficial (ej. una foto cualquiera), **Cuando** el sistema lo analiza, **Entonces** se me informa de que no se ha reconocido como un documento administrativo y no se genera una explicación inventada.

### Historia de Usuario 2 - Generar un borrador de respuesta o solicitud (Prioridad: P2)

Como usuario que ha entendido que la carta requiere una acción de mi parte (alegación, solicitud, justificante), quiero recibir un borrador de respuesta ya redactado, para no tener que escribirlo desde cero ni saber la fórmula administrativa correcta.

**Por qué esta prioridad**: aporta el segundo mayor valor (pasar de "entender" a "actuar"), pero depende de que la Historia 1 ya haya identificado correctamente qué pide la carta.

**Test independiente**: se puede probar partiendo de un resumen ya generado y comprobando que el borrador resultante responde de forma coherente a lo que la carta solicitaba, sin depender de recordatorios ni historial.

**Escenarios de aceptación**:
1. **Dado** que el resumen de la carta indica que se requiere una respuesta o solicitud, **Cuando** el usuario pide generar el borrador, **Entonces** recibe un texto formal completo (encabezado, cuerpo, cierre) listo para revisar, firmar y enviar.
2. **Dado** que el borrador generado, **Cuando** el usuario quiere modificarlo, **Entonces** puede editar el texto libremente antes de darlo por definitivo.
3. **Dado** que la carta es meramente informativa y no requiere respuesta, **Cuando** el usuario llega a esta pantalla, **Entonces** se le indica que no es necesaria ninguna acción y no se fuerza la generación de un borrador.

### Historia de Usuario 3 - Guardar el aviso y recibir recordatorio del plazo (Prioridad: P3)

Como usuario con una carta que tiene fecha límite, quiero que se me recuerde antes de que venza el plazo, para no perder la oportunidad de responder a tiempo.

**Por qué esta prioridad**: añade valor de seguimiento, pero el producto ya es útil y completo sin ella (P1 y P2 resuelven el problema principal).

**Test independiente**: se puede probar registrando una carta con plazo y comprobando que llega un aviso antes de la fecha límite, de forma aislada del resto del flujo.

**Escenarios de aceptación**:
1. **Dado** que una carta procesada tiene una fecha límite identificada, **Cuando** el usuario opta por guardarla, **Entonces** recibe un recordatorio con antelación suficiente antes de que venza el plazo.
2. **Dado** que el usuario ya ha resuelto la gestión, **Cuando** marca la carta como "resuelta", **Entonces** no se le envían más recordatorios sobre ese documento.

### Casos límite

- ¿Qué pasa si la carta está en un idioma distinto al del usuario?
- ¿Qué pasa si la carta contiene varias páginas o varios asuntos distintos en el mismo documento?
- ¿Cómo se comporta el sistema si la fecha límite ya ha pasado en el momento de subir la carta?
- ¿Qué pasa si la carta contiene datos personales sensibles (salud, situación económica) que el usuario no querría almacenar?
- ¿Qué pasa si el usuario no tiene forma de hacer una foto nítida (mala cámara, mala luz)?
- ¿Qué pasa si la explicación generada resulta incorrecta o incompleta respecto al contenido real de la carta?

## Requisitos *(obligatorio)*

### Requisitos funcionales

- **FR-001**: El sistema DEBE permitir a un usuario subir una imagen o fotografía de un documento.
- **FR-002**: El sistema DEBE generar, a partir del documento subido, un resumen en lenguaje sencillo que identifique el organismo emisor, el asunto y si requiere acción del usuario.
- **FR-003**: El sistema DEBE destacar de forma explícita cualquier fecha límite o plazo mencionado en el documento.
- **FR-004**: El sistema DEBE informar al usuario cuando el documento no se puede leer con suficiente calidad, en vez de generar una explicación no fiable.
- **FR-005**: El sistema DEBE informar al usuario cuando el documento subido no parece ser una carta o comunicación oficial.
- **FR-006**: El sistema DEBE permitir generar un borrador de respuesta o solicitud cuando la carta lo requiera.
- **FR-007**: El sistema DEBE permitir al usuario editar el borrador de respuesta antes de considerarlo definitivo.
- **FR-008**: El sistema DEBE indicar cuando una carta es meramente informativa y no requiere respuesta.
- **FR-009**: El sistema DEBE permitir guardar una carta procesada para hacer seguimiento de su plazo sin requerir que el usuario cree una cuenta o inicie sesión.
- **FR-010**: El sistema DEBE enviar recordatorios al usuario en los siguientes momentos antes de que venza el plazo de una carta guardada: 7, 5, 3, 2 y 1 día.
- **FR-011**: El sistema DEBE permitir al usuario marcar una carta como resuelta para dejar de recibir recordatorios sobre ella.
- **FR-012**: El sistema DEBE conservar tanto la imagen original como el resumen generado durante un máximo de 30 días después de la consulta y de la expiración del plazo de la carta, y eliminarlos automáticamente transcurrido ese periodo.
- **FR-013**: El sistema DEBE soportar documentos redactados en español.

### Entidades clave

- **Documento subido**: la imagen o fotografía original aportada por el usuario; representa la carta oficial tal cual fue recibida.
- **Explicación generada**: el resumen en lenguaje sencillo derivado del documento, con organismo emisor, asunto, acción requerida y plazo.
- **Borrador de respuesta**: el texto formal generado para responder o solicitar algo en relación con el documento, editable por el usuario.
- **Recordatorio de plazo**: aviso asociado a una carta guardada, vinculado a su fecha límite y a su estado (pendiente / resuelta).

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **SC-001**: El 90% de los usuarios que suben una carta legible es capaz de identificar correctamente, tras leer la explicación, si tiene que actuar y antes de qué fecha.
- **SC-002**: El tiempo que un usuario tarda en entender una carta oficial se reduce, pasando de necesitar ayuda de terceros a resolverlo solo en menos de 5 minutos.
- **SC-003**: Al menos el 60% de los usuarios que reciben un borrador de respuesta lo utiliza (tal cual o editado) para responder, en vez de descartarlo.
- **SC-004**: El 80% de los recordatorios de plazo se entregan con tiempo suficiente para que el usuario pueda actuar antes de la fecha límite.

## Suposiciones

- El usuario dispone de un teléfono con cámara para fotografiar el documento.
- Las cartas objetivo son principalmente de organismos públicos (Hacienda, Seguridad Social, ayuntamientos) y entidades bancarias en España, redactadas en español.
- La explicación generada es informativa y de apoyo a la comprensión, no constituye asesoría legal ni fiscal vinculante.
- El público principal son personas mayores; por eso el producto se guarda sin cuenta ni login en esta fase.
- El usuario tiene un nivel de alfabetización digital básico (sabe hacer una foto y subirla), aunque no domine el lenguaje administrativo.

## Fuera de alcance en esta fase (a valorar en fases futuras)

- La presentación o envío automático de la respuesta ante el organismo (el usuario la envía por sus propios medios).
- La gestión de trámites que requieran firma digital o identificación oficial (Cl@ve, certificado digital).
- Cualquier mecanismo de cuenta/login del usuario (hoy el guardado es local y sin identificación).
