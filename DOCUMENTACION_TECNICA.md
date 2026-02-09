# DOCUMENTACIÓN TÉCNICA E INFORME DE CALIDAD: GNOSIS CRM

**Versión:** 2.2
**Fecha:** 30 de Enero de 2026
**Proyecto:** Gnosis CRM Landing Page & System
**Framework:** Angular 21 + Node.js/Express

---

## INTRODUCCIÓN Y ALCANCE

El presente reporte establece el plan de calidad para el proyecto **Gnosis CRM**. 

Para garantizar la calidad del software, es indispensable delimitar primero su alcance y comprender la problemática actual. El sistema Gnosis no interviene en la fase de manufactura; su ciclo de vida comienza una vez que el producto terminado está listo para la venta. El objetivo es digitalizar la gestión de la cartera de clientes, un proceso que actualmente se realiza de forma analógica y desarticulada.

Este documento demuestra cómo el desarrollo del software se alinea estrictamente con los estándares internacionales **ISO/IEC 12207** (Procesos del Ciclo de Vida del Software) e **ISO/IEC 25010** (Modelos de Calidad de Sistemas y Software).

---

## CAPÍTULO 1: ANTECEDENTES Y ESTADO DEL ARTE

### 1.1 Problemática: Limitaciones de Herramientas Tradicionales
Para justificar el desarrollo de Gnosis, se analizaron las herramientas utilizadas por las PyMEs, identificando fallos críticos:

*   **Gestión en Hojas de Cálculo (Excel):** Genera duplicidad de datos, falta de seguridad y bloquea la colaboración en tiempo real.
    > ![Captura de Excel desordenado](assets/img/legacy_excel_example.png)
    > *Sugerencia: Incluir captura de un Excel típico con datos desordenados.*
*   **Envío Manual de Correos:** Provoca bloqueos por SPAM y carece de métricas de lectura.
*   **Caos Omnicanal:** Tener Facebook, Instagram y WhatsApp en pestañas separadas causa pérdida de mensajes.

### 1.2 Análisis Competitivo (Benchmarking Regional)
Estudio del fallo de herramientas actuales en el contexto de la maquila regional (Mérida, Yucatán):

1.  **Odoo CRM:** Complejidad excesiva y arquitectura monolítica. Obliga a configurar inventarios complejos para ventas básicas.
2.  **Pulpos:** Limitado a POS (Punto de Venta), sin herramientas B2B ni automatización de marketing.
3.  **HubSpot / Salesforce:** Inviabilidad económica por costos en dólares y requisitos de hardware/red elevados.

### 1.3 Análisis FODA (SWOT) - Propuesta Gnosis
| Fortalezas | Debilidades |
| :--- | :--- |
| **Arquitectura Reactiva (Signals):** Rendimiento superior en actualizaciones de DOM. | **Madurez:** Producto en fase inicial comparado con competidores globales. |
| **UX Simplificada:** Diseñada para "No-Tech Users" y PyMEs. | **Ecosistema:** Menor cantidad de integraciones nativas al lanzamiento. |
| **Costo-Eficiencia:** Arquitectura optimizada para servidores económicos (Render). | |

| Oportunidades | Amenazas |
| :--- | :--- |
| **Nicho desatendido:** PyMEs abrumadas por Excel pero asustadas de Salesforce. | **Guerra de Precios:** Competidores grandes bajando precios temporalmente. |
| **Necesidad Omnicanal:** Demanda creciente de centralizar redes sociales. | **Saturación:** Mercado CRM altamente competitivo. |

### 1.4 Justificación Tecnológica (Stack Moderno)
Gnosis selecciona tecnología de vanguardia (2025-2026) para diferenciarse por Rendimiento y Mantenibilidad.

*   **Angular 21 + Signals:** Gestión de estado granular (`isAnnual = signal(true)`) sin la sobrecarga de Zone.js, resultando en una interfaz fluida.
*   **Server-Side Rendering (SSR):** Implementado con `provideClientHydration(withEventReplay())` para interactividad inmediata incluso en móviles 3G.
*   **Backend Asíncrono:** Node.js con colas **BullMQ** sobre **Redis** para el procesamiento masivo de correos sin bloquear el Event Loop.

---

## CAPÍTULO 2: TRANSFORMACIÓN DE PROCESOS (ISO/IEC 12207)

### 2.1 De lo Manual a lo Automatizado
Comparativa de la evolución operativa lograda con Gnosis:

#### Fase 1: Gestión de la Información (Centralización)
*   *Antes:* Datos dispersos en libretas/Excel.
*   *Ahora:* **Directorio de Clientes en la Nube**. Fuente única de verdad con seguridad JWT.
    > ![Directorio de Clientes Gnosis](assets/img/gnosis_clients_directory.png)

#### Fase 2: Ejecución de Marketing (Envíos)
*   *Antes:* Redacción manual 1 a 1, riesgo de SPAM.
*   *Ahora:* **Colas de Trabajo (BullMQ)**. Envío asíncrono y dosificado garantizando entregabilidad.
    > ![Diagrama de Colas BullMQ](assets/img/architecture_queues.png)

#### Fase 3: Atención Omnicanal
*   *Antes:* Múltiples pestañas abiertas, mensajes perdidos.
*   *Ahora:* **Bandeja Unificada**. Conexión API a Meta para responder todo desde un solo lugar.
    > ![Bandeja Unificada](assets/img/unified_inbox.png)

#### Fase 4: Inteligencia de Negocio
*   *Antes:* Intuición.
*   *Ahora:* **Dashboard de Métricas**. Reportes de apertura y tiempos de respuesta.
    > ![Dashboard de Reportes](assets/img/dashboard_analytics.png)

### 2.2 Narrativa Evolutiva del Desarrollo (Historia Técnica)
Documentación de incertidumbres y soluciones estratégicas ("War Stories").

#### 2.2.1 Alcance: La Decisión "Post-Manufactura"
*   *Crisis:* ¿Incluir gestión de telas?
*   *Resolución:* Delimitar el alcance a la comercialización para evitar competir con ERPs de producción y enfocar la calidad en la omnicanalidad.

#### 2.2.2 Arquitectura: La Crisis del Servidor Bloqueado
*   *Fallo:* El servidor Node.js (monohilo) se congelaba al enviar 50 correos.
*   *Solución:* Implementación de **Workers** y **Redis**. Ahora el servidor solo "anota" la tarea y responde en milisegundos.

#### 2.2.3 Datos: El Refactor "Soft Delete"
*   *Problema:* Borrar campañas eliminaba estadísticas históricas necesarias para reportes anuales.
*   *Solución:* Implementación de `paranoid: true` (Sequelize). Los datos se ocultan lógica pero no físicamente.

#### 2.2.4 Interfaz: Del Excel a la Experiencia Visual
*   *Feedback:* "Se parece a un Excel".
*   *Mejora:* Rediseño con gráficas dinámicas y tarjetas visuales.
*   *Tiempo Real:* Cambio de refresco manual a **WebSockets (Socket.io)** para la mensajería instantánea.

#### 2.2.5 Integración: El Reto Meta API
*   *Problema:* Documentación ambigua sobre webhooks.
*   *Solución:* Creación de un módulo de **Normalización de Mensajes** para estandarizar formatos de entrada de Facebook/Instagram.

---

## CAPÍTULO 3: EVALUACIÓN DE CALIDAD DEL PRODUCTO (ISO/IEC 25010)

Justificación técnica de las 8 características de calidad.

### 3.1 Adecuación Funcional
| Implementación | Motivo | Impacto |
| :--- | :--- | :--- |
| **CRUD Clientes** | Gestión de datos maestros. | Ciclo de vida completo del cliente. |
| **Segmentación** | Filtrado de BD. | Marketing dirigido y preciso. |

### 3.2 Eficiencia de Desempeño
| Implementación | Motivo | Impacto |
| :--- | :--- | :--- |
| **BullMQ Workers** | Non-blocking I/O. | Servidor responde mientras procesa fondo. |
| **SSR / Hydration** | Latencia en móviles. | Carga inicial inmediata (LCP < 0.8s). |

### 3.3 Compatibilidad
| Implementación | Motivo | Impacto |
| :--- | :--- | :--- |
| **CORS / REST** | Seguridad navegador. | Interoperabilidad Frontend/Backend separados. |
| **HTML5 Semántico** | SEO y Parsers. | Indexabilidad y accesibilidad. |

### 3.4 Usabilidad
| Implementación | Motivo | Impacto |
| :--- | :--- | :--- |
| **Diseño "Hero"** | Primera impresión. | Estética y confianza profesional. |
| **Feedback Visual** | Visibilidad estado. | Menor frustración (Spinners/Toasts). |

### 3.5 Fiabilidad
| Implementación | Motivo | Impacto |
| :--- | :--- | :--- |
| **Global Error Handling** | Excepciones imprevistas. | Estabilidad (Servidor no cae). |
| **Reconexión BD** | Fallos de red. | Recuperabilidad automática. |

### 3.6 Seguridad
| Implementación | Motivo | Impacto |
| :--- | :--- | :--- |
| **JWT / Bcrypt** | Stateless HTTP. | Confidencialidad de sesiones y credenciales. |
| **Sanitización Angular** | XSS Attacks. | Integridad del DOM cliente. |

### 3.7 Mantenibilidad
| Implementación | Motivo | Impacto |
| :--- | :--- | :--- |
| **Arquitectura Modular** | Monolito inmanejable. | Fácil localización de bugs. |
| **Componentes Standalone** | Boilerplate Angular. | Independencia y Reusabilidad. |

### 3.8 Portabilidad
| Implementación | Motivo | Impacto |
| :--- | :--- | :--- |
| **Variables .env** | Entornos cambiantes. | Adaptabilidad Dev/Prod/Cloud. |
| **Responsive CSS** | Diversidad dispositivos. | Funciona en Desktop/Tablet/Móvil. |

---

## CAPÍTULO 4: CALIDAD EN USO (IMPACTO REAL)

1.  **Efectividad:** ALTA. Segmentación precisa sin falsos positivos.
2.  **Eficiencia:** OPTIMIZADA. El usuario trabaja mientras el sistema procesa colas.
3.  **Satisfacción:** POSITIVA. Interfaz moderna superior a herramientas legacy.
4.  **Libertad de Riesgos:** CONTROLADA. Backups lógicos (Soft Delete) y seguridad JWT.
5.  **Cobertura de Contexto:** FLEXIBLE. Acceso universal vía Web.

---
## CAPÍTULO 5: DISEÑO Y NORMALIZACIÓN DE BASE DE DATOS

Este capítulo detalla la estructura lógica de los datos, asegurando integridad, eficiencia y escalabilidad mediante el uso estricto de restricciones y normalización.

### 5.1 Identificación del uso de Restricciones
Se utilizan las siguientes restricciones en el Sistema Gestor de Base de Datos (PostgreSQL) para garantizar la calidad de los datos.

#### 5.1.1 PRIMARY KEY (Llave Primaria)
Identificador único para cada registro.
*   **Tabla:** `Clientes`
*   **Columna:** `id_cliente` (UUID)
*   **Caso de Prueba 1 (Éxito):** Insertar cliente con ID único `550e8400-e29b...`. -> *Registro creado.*
*   **Caso de Prueba 2 (Fallo):** Insertar cliente con ID `550e8400-e29b...` ya existente. -> *Error: Duplicate key value violates unique constraint.*

#### 5.1.2 FOREIGN KEY (Llave Foránea)
Asegura la integridad referencial entre tablas.
*   **Tabla:** `Ventas`
*   **Columna:** `id_cliente` (Referencia a `Clientes.id_cliente`)
*   **Caso de Prueba 1 (Éxito):** Crear venta para el cliente existente `ID_123`. -> *Venta asociada correctamente.*
*   **Caso de Prueba 2 (Fallo):** Crear venta para el cliente `ID_999` (no existe). -> *Error: Insert or update on table "Ventas" violates foreign key constraint.*

#### 5.1.3 UNIQUE (Unicidad)
Evita duplicidad en campos que no son llave primaria pero deben ser únicos.
*   **Tabla:** `Usuarios`
*   **Columna:** `email`
*   **Caso de Prueba 1 (Éxito):** Registrar `admin@gnosis.com`. -> *Usuario registrado.*
*   **Caso de Prueba 2 (Fallo):** Registrar nuevamente `admin@gnosis.com`. -> *Error: Key (email)=(admin@gnosis.com) already exists.*

#### 5.1.4 CHECK (Verificación)
Valida que los datos cumplan una condición específica.
*   **Tabla:** `Productos`
*   **Columna:** `precio` (`CHECK (precio >= 0)`)
*   **Caso de Prueba 1 (Éxito):** Insertar producto con precio `$150.00`. -> *Producto guardado.*
*   **Caso de Prueba 2 (Fallo):** Insertar producto con precio `$-10.00`. -> *Error: New row for relation "Productos" violates check constraint.*

#### 5.1.5 DEFAULT (Valor por Defecto)
Asigna un valor automático si no se especifica.
*   **Tabla:** `Campañas`
*   **Columna:** `fecha_creacion` (`DEFAULT CURRENT_TIMESTAMP`)
*   **Caso de Prueba 1 (Éxito):** Insertar campaña sin especificar fecha. -> *Guardado con fecha/hora actual.*
*   **Caso de Prueba 2 (Éxito):** Insertar campaña especificando `2025-01-01`. -> *Guardado con fecha manual.*

---

### 5.2 Normalización (1FN, 2FN y 3FN)
Proceso de organización de datos para reducir la redundancia. A continuación, se muestra la evolución de una tabla de "Registro de Ventas" no normalizada hasta la 3FN, utilizando un conjunto de datos de muestra.

#### Estado Inicial: Tabla No Normalizada (Datos Repetidos)
| Folio | Fecha | Cliente | Dirección | Email | Producto | Precio | Cantidad | Total |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 101 | 2026-01-30 | Juan Pérez | Calle 10 #50 | juan@mail.com | Licencia Pro | 500 | 1 | 500 |
| 101 | 2026-01-30 | Juan Pérez | Calle 10 #50 | juan@mail.com | Soporte | 100 | 2 | 200 |
| 102 | 2026-01-31 | Ana Gómez | Av. Vallarta 200 | ana@mail.com | Licencia Pro | 500 | 1 | 500 |
| 103 | 2026-02-01 | Luis Ry | Centro 44 | luis@mail.com | Consultoría | 800 | 1 | 800 |
| 103 | 2026-02-01 | Luis Ry | Centro 44 | luis@mail.com | Hosting | 200 | 1 | 200 |
| 104 | 2026-02-02 | Sofia M | Norte 2 | sofia@mail.com | Soporte | 100 | 1 | 100 |
| 105 | 2026-02-02 | Pedro K | Sur 8 | pedro@mail.com | Licencia Pro | 500 | 3 | 1500 |
| 106 | 2026-02-03 | Maria L | Este 9 | maria@mail.com | Dominio | 50 | 1 | 50 |
| 107 | 2026-02-04 | Beto J | Oeste 1 | beto@mail.com | Consultoría | 800 | 2 | 1600 |
| 108 | 2026-02-05 | Carla T | Plaza 5 | carla@mail.com | Soporte | 100 | 5 | 500 |

#### Primera Forma Normal (1FN)
*Regla: Eliminar grupos repetidos y asegurar atomicidad.*
Se separan los detalles de la venta maestra, pero aún hay redundancia de cliente.

**Tabla: Ventas_Detalle (1FN)**
| Folio | Producto_ID | Nombre_Producto | Precio_Unitario | Cantidad | Cliente_Nombre | Cliente_Email |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 101 | P01 | Licencia Pro | 500 | 1 | Juan Pérez | juan@mail.com |
| 101 | P02 | Soporte | 100 | 2 | Juan Pérez | juan@mail.com |
| 102 | P01 | Licencia Pro | 500 | 1 | Ana Gómez | ana@mail.com |
| 103 | P03 | Consultoría | 800 | 1 | Luis Ry | luis@mail.com |
| 103 | P04 | Hosting | 200 | 1 | Luis Ry | luis@mail.com |
| 104 | P02 | Soporte | 100 | 1 | Sofia M | sofia@mail.com |
| 105 | P01 | Licencia Pro | 500 | 3 | Pedro K | pedro@mail.com |
| 106 | P05 | Dominio | 50 | 1 | Maria L | maria@mail.com |
| 107 | P03 | Consultoría | 800 | 2 | Beto J | beto@mail.com |
| 108 | P02 | Soporte | 100 | 5 | Carla T | carla@mail.com |

#### Segunda Forma Normal (2FN)
*Regla: Eliminar dependencias parciales.*
Separamos los productos (dependencia de Producto_ID) de los detalles de venta.

**Tabla: Productos (2FN)** - Catálogo único
| ID_Producto | Nombre | Precio |
| :--- | :--- | :--- |
| P01 | Licencia Pro | 500 |
| P02 | Soporte | 100 |
| P03 | Consultoría | 800 |
| P04 | Hosting | 200 |
| P05 | Dominio | 50 |

**Tabla: Detalle_Ventas (2FN)**
| Folio | ID_Producto | Cantidad |
| :--- | :--- | :--- |
| 101 | P01 | 1 |
| 101 | P02 | 2 |
| 102 | P01 | 1 |
| 103 | P03 | 1 |
| 103 | P04 | 1 |
| 104 | P02 | 1 |
| 105 | P01 | 3 |
| 106 | P05 | 1 |
| 107 | P03 | 2 |
| 108 | P02 | 5 |

#### Tercera Forma Normal (3FN)
*Regla: Eliminar dependencias transitivas (Cliente).*
Separamos la información del Cliente de la tabla de Ventas maestra.

**Tabla Final: Clientes (3FN)** - 10 Registros
| ID | Nombre | Email | Dirección |
| :--- | :--- | :--- | :--- |
| C01 | Juan Pérez | juan@mail.com | Calle 10 #50 |
| C02 | Ana Gómez | ana@mail.com | Av. Vallarta 200 |
| C03 | Luis Ry | luis@mail.com | Centro 44 |
| C04 | Sofia M | sofia@mail.com | Norte 2 |
| C05 | Pedro K | pedro@mail.com | Sur 8 |
| C06 | Maria L | maria@mail.com | Este 9 |
| C07 | Beto J | beto@mail.com | Oeste 1 |
| C08 | Carla T | carla@mail.com | Plaza 5 |
| C09 | Raul Z | raul@mail.com | Calle 7 |
| C10 | Diana Q | diana@mail.com | Av. 1 |

**Tabla Final: Ventas (3FN)** - Referencia ID_Cliente (10 Registros)
| Folio | Fecha | ID_Cliente | Total |
| :--- | :--- | :--- | :--- |
| 101 | 2026-01-30 | C01 | 700 |
| 102 | 2026-01-31 | C02 | 500 |
| 103 | 2026-02-01 | C03 | 1000 |
| 104 | 2026-02-02 | C04 | 100 |
| 105 | 2026-02-02 | C05 | 1500 |
| 106 | 2026-02-03 | C06 | 50 |
| 107 | 2026-02-04 | C07 | 1600 |
| 108 | 2026-02-05 | C08 | 500 |
| 109 | 2026-02-06 | C09 | 0 |
| 110 | 2026-02-07 | C10 | 0 |

---

### 5.3 Modelo Relacional de la Base de Datos
**Sistema Gestor de Base de Datos (SGBD):** PostgreSQL 16.

El siguiente diagrama entidad-relación (DER) ilustra la arquitectura de la información, destacando las relaciones entre Clientes, Campañas, Envíos y Usuarios.

> ![Diagrama Entidad Relación Gnosis](assets/img/der_postgres_gnosis.png)
> *Descripción: Modelo lógico normalizado en 3FN implementado en PostgreSQL.*

---
*Fin del Documento Técnico Integral.*
