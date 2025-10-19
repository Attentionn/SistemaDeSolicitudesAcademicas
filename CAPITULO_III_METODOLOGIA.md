# CAPÍTULO III: METODOLOGÍA

## 3.1 METODOLOGÍA

En esta sección se define el enfoque metodológico utilizado para el desarrollo de la aplicación web "Sistema de Solicitudes Académicas para Estudiantes Neurodiversos", describiendo las etapas del proceso de desarrollo, las técnicas empleadas y la justificación de la metodología seleccionada.

### 3.1.1 Tipo de investigación

**Investigación aplicada**
La presente investigación se clasifica como aplicada, ya que busca resolver un problema específico identificado en el contexto educativo: la gestión eficiente de solicitudes de acomodaciones y faltas para estudiantes neurodiversos. El objetivo principal es desarrollar una solución tecnológica práctica que mejore los procesos administrativos y académicos.

**Enfoque mixto (cualitativo-cuantitativo)**
- **Enfoque cualitativo**: Se utilizó para comprender las necesidades específicas de los usuarios (estudiantes, profesores y administradores) a través de análisis de casos de uso y requerimientos funcionales.
- **Enfoque cuantitativo**: Se aplicó para medir el rendimiento del sistema, tiempos de respuesta y métricas de usabilidad.

**Nivel de investigación: Descriptivo**
La investigación se enfoca en describir y analizar el estado actual del proceso de gestión de solicitudes académicas, identificando las limitaciones y proponiendo una solución tecnológica que mejore la eficiencia y accesibilidad del sistema.

### 3.1.2 Metodología de desarrollo de software

**Metodología seleccionada: Desarrollo Ágil (Agile)**

**Justificación de la selección:**
- **Flexibilidad**: Permite adaptar el desarrollo a los cambios en los requerimientos
- **Iteraciones cortas**: Facilita la entrega de funcionalidades incrementales
- **Colaboración**: Promueve la comunicación constante entre desarrolladores y usuarios
- **Retroalimentación continua**: Permite ajustes rápidos basados en pruebas de usuario

**Fases del proceso:**
1. **Planificación inicial**: Definición de requerimientos y arquitectura
2. **Sprint 1**: Desarrollo del backend y modelos de datos
3. **Sprint 2**: Implementación de autenticación y rutas básicas
4. **Sprint 3**: Desarrollo del frontend y componentes principales
5. **Sprint 4**: Integración y pruebas del sistema completo
6. **Sprint 5**: Optimización y despliegue

### 3.1.3 Herramientas y tecnologías

**Lenguajes de programación:**
- **JavaScript (Node.js)**: Para el desarrollo del backend
- **JavaScript (React)**: Para el desarrollo del frontend
- **SQL**: Para consultas y gestión de base de datos

**Frameworks y librerías:**
- **Backend:**
  - Express.js: Framework web para Node.js
  - Sequelize: ORM para gestión de base de datos
  - bcryptjs: Para encriptación de contraseñas
  - jsonwebtoken: Para autenticación JWT
  - cors: Para manejo de CORS

- **Frontend:**
  - React 18.2.0: Biblioteca para interfaces de usuario
  - React Router DOM: Para navegación
  - Axios: Para peticiones HTTP
  - Tailwind CSS: Framework de estilos
  - Headless UI: Componentes de interfaz

**Base de datos:**
- **SQLite**: Base de datos relacional ligera para desarrollo y pruebas
- **Características**: Transaccional, ACID compliant, sin servidor

**Herramientas de desarrollo:**
- **Node.js**: Entorno de ejecución de JavaScript
- **npm**: Gestor de paquetes
- **Nodemon**: Para desarrollo con recarga automática
- **Git**: Control de versiones

**Entorno de desarrollo:**
- **Sistema operativo**: Windows 10
- **Editor**: Visual Studio Code / Cursor
- **Navegador**: Chrome, Firefox, Safari (compatibilidad multiplataforma)
- **Servidor local**: Express.js en puerto 5000
- **Cliente local**: React en puerto 3000

### 3.1.4 Técnicas de recolección de datos

**Análisis documental:**
- Revisión de literatura sobre sistemas de gestión académica
- Análisis de casos de uso similares en instituciones educativas
- Estudio de mejores prácticas en desarrollo de aplicaciones web

**Observación directa:**
- Análisis del flujo actual de solicitudes académicas
- Identificación de puntos de mejora en procesos existentes
- Evaluación de interfaces de usuario de sistemas similares

**Prototipado y pruebas:**
- Desarrollo de wireframes y mockups
- Pruebas de usabilidad con usuarios potenciales
- Validación de funcionalidades mediante testing

## 3.2 REQUERIMIENTOS DE LA APLICACIÓN WEB

Esta sección presenta la especificación detallada de los requerimientos funcionales y no funcionales que debe cumplir la aplicación web, obtenidos a través del análisis de necesidades del usuario.

### 3.2.1 Requerimientos funcionales

**RF01: Gestión de usuarios**
- El sistema debe permitir el registro de usuarios con roles diferenciados (estudiante, profesor, administrador)
- Debe validar la unicidad de emails y códigos de estudiante
- Debe encriptar las contraseñas usando bcrypt

**RF02: Autenticación y autorización**
- El sistema debe permitir el login de usuarios registrados
- Debe mantener sesiones de usuario activas
- Debe controlar el acceso a funcionalidades según el rol del usuario

**RF03: Gestión de cursos**
- El sistema debe permitir la creación y gestión de cursos
- Debe asociar profesores a cursos específicos
- Debe permitir la consulta de cursos por estudiante o profesor

**RF04: Solicitudes de acomodación**
- El sistema debe permitir a los estudiantes crear solicitudes de acomodación
- Debe soportar diferentes tipos: cambio de fecha de examen, cambio de aula, solicitud de notas, extensión de tareas, etc.
- Debe permitir a los profesores aprobar o rechazar solicitudes
- Debe incluir campos para motivo, fechas originales y propuestas

**RF05: Gestión de faltas**
- El sistema debe permitir el registro de faltas de estudiantes
- Debe clasificar las faltas como justificadas, injustificadas o previstas
- Debe permitir observaciones del profesor

**RF06: Dashboard administrativo**
- El sistema debe proporcionar una vista consolidada de todas las solicitudes
- Debe permitir filtrado por estado, tipo y usuario
- Debe mostrar estadísticas y métricas del sistema

**RF07: Notificaciones y seguimiento**
- El sistema debe permitir el seguimiento del estado de las solicitudes
- Debe mostrar comentarios y respuestas de profesores
- Debe mantener un historial de cambios

### 3.2.2 Requerimientos no funcionales

#### 3.2.2.1 Requerimientos de rendimiento
- **Tiempo de respuesta**: Las páginas deben cargar en menos de 3 segundos
- **Capacidad de usuarios concurrentes**: Soporte para al menos 100 usuarios simultáneos
- **Throughput del sistema**: Capacidad de procesar 1000 solicitudes por hora

#### 3.2.2.2 Requerimientos de seguridad
- **Autenticación**: Sistema de login seguro con validación de credenciales
- **Autorización**: Control de acceso basado en roles de usuario
- **Protección de datos**: Encriptación de contraseñas y datos sensibles
- **Cifrado**: Uso de HTTPS en producción

#### 3.2.2.3 Requerimientos de usabilidad
- **Facilidad de uso**: Interfaz intuitiva con navegación clara
- **Accesibilidad**: Compatible con estándares WCAG 2.1
- **Compatibilidad con navegadores**: Soporte para Chrome, Firefox, Safari y Edge
- **Diseño responsivo**: Adaptación a dispositivos móviles y tablets

#### 3.2.2.4 Requerimientos de disponibilidad
- **Tiempo de actividad**: 99% de disponibilidad durante horarios académicos
- **Tolerancia a fallos**: Recuperación automática de errores menores
- **Recuperación ante desastres**: Backup diario de la base de datos

### 3.2.3 Restricciones del sistema

**Limitaciones técnicas:**
- Base de datos SQLite para desarrollo (limitada a un solo usuario concurrente)
- Arquitectura monolítica (no microservicios)
- Sin integración con sistemas externos (LDAP, SSO)

**Restricciones de tiempo:**
- Desarrollo en 5 sprints de 2 semanas cada uno
- Entrega final en 10 semanas

**Restricciones de presupuesto:**
- Uso de tecnologías open source
- Sin costos de licencias de software
- Hosting en servidores gratuitos o de bajo costo

**Restricciones de recursos:**
- Equipo de desarrollo de 1-2 personas
- Sin acceso a infraestructura de producción
- Limitado a entornos de desarrollo y testing

## 3.3 MAPA DE NAVEGACIÓN O ARQUITECTURA DE INFORMACIÓN DE LA APLICACIÓN WEB

Se presenta la estructura organizacional de la información y los elementos de navegación de la aplicación web, definiendo cómo los usuarios interactuarán con el sistema y accederán a sus funcionalidades.

### 3.3.1 Arquitectura de información

**Jerarquía de contenidos:**
```
Sistema de Solicitudes Académicas
├── Autenticación
│   ├── Login
│   └── Registro
├── Dashboard Principal
│   ├── Resumen de solicitudes
│   ├── Estadísticas
│   └── Accesos rápidos
├── Gestión de Solicitudes
│   ├── Crear solicitud
│   ├── Ver mis solicitudes
│   └── Historial
├── Panel de Administración
│   ├── Gestión de usuarios
│   ├── Gestión de cursos
│   └── Reportes
└── Configuración
    ├── Perfil de usuario
    └── Preferencias
```

**Categorización de funcionalidades:**
- **Funcionalidades de estudiante**: Crear solicitudes, ver estado, gestionar perfil
- **Funcionalidades de profesor**: Revisar solicitudes, aprobar/rechazar, gestionar cursos
- **Funcionalidades de administrador**: Gestión completa del sistema, reportes, configuración

**Flujo de información:**
1. **Entrada**: Usuario accede al sistema mediante login
2. **Procesamiento**: Sistema valida credenciales y carga dashboard según rol
3. **Navegación**: Usuario accede a funcionalidades específicas de su rol
4. **Interacción**: Usuario realiza acciones (crear, modificar, consultar)
5. **Salida**: Sistema actualiza información y muestra resultados

### 3.3.2 Estructura de navegación

**Menú principal:**
- **Dashboard**: Página principal con resumen
- **Solicitudes**: Gestión de solicitudes de acomodación
- **Faltas**: Gestión de faltas de estudiantes
- **Mis Solicitudes**: Vista personal de solicitudes (estudiantes)
- **Administración**: Panel de control (administradores)

**Submenús y categorías:**
- **Solicitudes**:
  - Crear nueva solicitud
  - Ver solicitudes pendientes
  - Historial de solicitudes
- **Administración**:
  - Gestión de usuarios
  - Gestión de cursos
  - Reportes y estadísticas

**Rutas de navegación (breadcrumbs):**
- Dashboard > Solicitudes > Crear Solicitud
- Dashboard > Administración > Usuarios > Editar Usuario
- Dashboard > Mis Solicitudes > Ver Detalle

**Enlaces internos:**
- Navegación entre páginas relacionadas
- Enlaces de contexto en formularios
- Accesos rápidos desde dashboard

### 3.3.3 Mapa del sitio

**Páginas principales:**
1. **Login** (`/login`): Autenticación de usuarios
2. **Registro** (`/register`): Registro de nuevos usuarios
3. **Dashboard** (`/dashboard`): Página principal del sistema
4. **Solicitudes** (`/solicitudes`): Gestión de solicitudes de acomodación
5. **Faltas** (`/faltas`): Gestión de faltas de estudiantes
6. **Mis Solicitudes** (`/mis-solicitudes`): Vista personal de solicitudes
7. **Administración** (`/admin`): Panel de control administrativo

**Páginas secundarias:**
- **Perfil de Usuario**: Configuración personal
- **Detalle de Solicitud**: Vista detallada de solicitudes
- **Formularios**: Creación y edición de registros

**Páginas especiales:**
- **Error 404**: Página no encontrada
- **Error 500**: Error del servidor
- **Mantenimiento**: Página de mantenimiento del sistema

### 3.3.4 Flujos de usuario

**Casos de uso principales:**

1. **Flujo de estudiante:**
   - Login → Dashboard → Crear Solicitud → Enviar → Ver Estado

2. **Flujo de profesor:**
   - Login → Dashboard → Revisar Solicitudes → Aprobar/Rechazar → Comentar

3. **Flujo de administrador:**
   - Login → Dashboard → Gestión de Usuarios → Crear/Editar → Guardar

**Rutas de navegación típicas:**
- **Acceso inicial**: Login → Dashboard
- **Creación de solicitud**: Dashboard → Solicitudes → Crear → Formulario → Enviar
- **Revisión de solicitudes**: Dashboard → Solicitudes → Lista → Detalle → Acción

**Puntos de entrada y salida:**
- **Entrada**: Login, Registro, Enlaces externos
- **Salida**: Logout, Cierre de sesión, Navegación externa

## 3.4 MAQUETACIÓN

En esta sección se describe el proceso de creación de los prototipos y maquetas de la interfaz de usuario, definiendo el diseño visual y la disposición de elementos en cada pantalla de la aplicación.

### 3.4.1 Wireframes de baja fidelidad

**Sketches iniciales:**
- Diseño de layout principal con header, sidebar y contenido
- Distribución de elementos en formularios de solicitudes
- Estructura de tablas para listados de datos

**Estructura básica de páginas:**
```
┌─────────────────────────────────────┐
│ Header (Logo, Usuario, Logout)      │
├─────────────────────────────────────┤
│ Sidebar    │ Contenido Principal    │
│ - Dashboard│                        │
│ - Solicitud│                        │
│ - Faltas   │                        │
│ - Admin    │                        │
└─────────────────────────────────────┘
```

**Distribución de elementos:**
- **Header**: Navegación principal, información de usuario
- **Sidebar**: Menú de navegación por roles
- **Contenido**: Área principal de trabajo
- **Footer**: Información del sistema

### 3.4.2 Wireframes de alta fidelidad

**Prototipos detallados:**
- Diseño específico de cada página con elementos reales
- Posicionamiento exacto de botones, formularios y tablas
- Flujo de interacción entre componentes

**Especificaciones de diseño:**
- **Grid system**: 12 columnas para layout responsivo
- **Espaciado**: Sistema de espaciado consistente (4px, 8px, 16px, 24px, 32px)
- **Tipografía**: Jerarquía clara con tamaños definidos

**Interacciones básicas:**
- Hover states para botones y enlaces
- Estados de loading para operaciones asíncronas
- Feedback visual para acciones del usuario

### 3.4.3 Mockups y prototipos interactivos

**Diseño visual final:**
- **Paleta de colores**: Azul institucional (#2563EB), Verde éxito (#10B981), Rojo error (#EF4444)
- **Tipografías**: Inter para texto, Roboto para títulos
- **Iconografía**: Heroicons para consistencia visual

**Elementos interactivos:**
- **Botones**: Estados normal, hover, active, disabled
- **Formularios**: Validación en tiempo real, mensajes de error
- **Tablas**: Paginación, filtros, ordenamiento
- **Modales**: Confirmaciones y formularios emergentes

### 3.4.4 Guía de estilo

**Paleta de colores:**
- **Primario**: #2563EB (Azul)
- **Secundario**: #64748B (Gris)
- **Éxito**: #10B981 (Verde)
- **Advertencia**: #F59E0B (Amarillo)
- **Error**: #EF4444 (Rojo)
- **Fondo**: #F8FAFC (Gris claro)

**Tipografías:**
- **Títulos**: Roboto, 24px, 32px, 48px
- **Subtítulos**: Roboto, 18px, 20px
- **Texto**: Inter, 14px, 16px
- **Pequeño**: Inter, 12px

**Iconografía:**
- **Biblioteca**: Heroicons
- **Estilo**: Outline y solid
- **Tamaños**: 16px, 20px, 24px

**Componentes reutilizables:**
- **Botones**: Primary, Secondary, Danger, Success
- **Cards**: Con header, contenido y footer
- **Formularios**: Input, Select, Textarea, Checkbox
- **Tablas**: Con paginación y filtros
- **Modales**: Confirmación y formularios

### 3.4.5 Diseño responsivo

**Breakpoints para diferentes dispositivos:**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

**Adaptación móvil:**
- **Navegación**: Menú hamburguesa en móviles
- **Formularios**: Campos apilados verticalmente
- **Tablas**: Scroll horizontal o vista de cards
- **Botones**: Tamaño táctil mínimo 44px

**Pruebas de usabilidad:**
- **Dispositivos**: iPhone, Android, iPad, Desktop
- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Accesibilidad**: Contraste, navegación por teclado, lectores de pantalla

## 3.5 MODELO DE DATOS

Se presenta el diseño de la base de datos y la estructura de almacenamiento de información, incluyendo las entidades, relaciones y reglas de negocio que rigen la persistencia de datos.

### 3.5.1 Modelo conceptual

**Diagrama entidad-relación (ER):**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │   Course    │    │Accommodation│
│             │    │             │    │             │
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ name        │    │ name        │    │ type        │
│ email       │    │ code        │    │ status      │
│ password    │    │ teacherId   │    │ description │
│ role        │    │ (FK)        │    │ motivo      │
│ studentId   │    │             │    │ studentId   │
│ faculty     │    │             │    │ (FK)        │
└─────────────┘    └─────────────┘    │ courseId    │
       │                   │          │ (FK)        │
       │                   │          │ teacherId   │
       │                   │          │ (FK)        │
       │                   │          └─────────────┘
       │                   │
       │                   │
       │          ┌─────────────┐
       │          │   Absence   │
       │          │             │
       └──────────│ id (PK)     │
                  │ fecha       │
                  │ materia     │
                  │ motivo      │
                  │ tipo        │
                  │ studentId   │
                  │ (FK)        │
                  │ courseId    │
                  │ (FK)        │
                  │ teacherId   │
                  │ (FK)        │
                  └─────────────┘
```

**Identificación de entidades:**
- **User**: Usuarios del sistema (estudiantes, profesores, administradores)
- **Course**: Cursos académicos
- **Accommodation**: Solicitudes de acomodación
- **Absence**: Registro de faltas de estudiantes

**Definición de atributos:**
- **User**: Información personal y credenciales de acceso
- **Course**: Datos del curso y profesor asignado
- **Accommodation**: Detalles de la solicitud y estado
- **Absence**: Información de la falta y clasificación

**Relaciones entre entidades:**
- **User-Course**: Un profesor puede tener múltiples cursos (1:N)
- **User-Accommodation**: Un estudiante puede tener múltiples solicitudes (1:N)
- **Course-Accommodation**: Un curso puede tener múltiples solicitudes (1:N)
- **User-Absence**: Un estudiante puede tener múltiples faltas (1:N)

### 3.5.2 Modelo lógico

**Normalización de la base de datos:**
- **Primera forma normal (1NF)**: Todos los atributos son atómicos
- **Segunda forma normal (2NF)**: Eliminación de dependencias parciales
- **Tercera forma normal (3NF)**: Eliminación de dependencias transitivas

**Tablas y campos:**

**Tabla Users:**
```sql
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    studentId VARCHAR(255) UNIQUE,
    faculty VARCHAR(255)
);
```

**Tabla Courses:**
```sql
CREATE TABLE Courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE NOT NULL,
    teacherId INTEGER NOT NULL,
    FOREIGN KEY (teacherId) REFERENCES Users(id)
);
```

**Tabla Accommodations:**
```sql
CREATE TABLE Accommodations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type ENUM('exam_date_change', 'classroom_change', 'notes_request', 
              'assignment_extension', 'deadline_extension', 'exam_change', 
              'absence_notification') NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    description TEXT NOT NULL,
    motivo TEXT,
    requestedDate DATETIME NOT NULL,
    newDate DATETIME,
    newClassroom VARCHAR(255),
    extensionDays INTEGER,
    teacherResponse TEXT,
    studentId INTEGER NOT NULL,
    courseId INTEGER NOT NULL,
    teacherId INTEGER NOT NULL,
    FOREIGN KEY (studentId) REFERENCES Users(id),
    FOREIGN KEY (courseId) REFERENCES Courses(id),
    FOREIGN KEY (teacherId) REFERENCES Users(id)
);
```

**Tabla Absences:**
```sql
CREATE TABLE Absences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATETIME NOT NULL,
    materia VARCHAR(255) NOT NULL,
    motivo TEXT,
    tipo ENUM('justificada', 'injustificada', 'prevista') DEFAULT 'injustificada',
    observaciones TEXT,
    studentId INTEGER NOT NULL,
    courseId INTEGER NOT NULL,
    teacherId INTEGER NOT NULL,
    FOREIGN KEY (studentId) REFERENCES Users(id),
    FOREIGN KEY (courseId) REFERENCES Courses(id),
    FOREIGN KEY (teacherId) REFERENCES Users(id)
);
```

**Claves primarias y foráneas:**
- **Claves primarias**: id en todas las tablas (INTEGER AUTOINCREMENT)
- **Claves foráneas**: Relaciones entre tablas para integridad referencial
- **Índices**: En campos de búsqueda frecuente (email, studentId, courseId)

**Índices y constrains:**
- **Índices únicos**: email, studentId, course.code
- **Índices de búsqueda**: role, status, type, fecha
- **Constraints**: NOT NULL, UNIQUE, CHECK para validaciones

### 3.5.3 Modelo físico

**Script de creación de base de datos:**
```sql
-- Configuración de SQLite
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;

-- Creación de tablas con Sequelize ORM
-- Las tablas se crean automáticamente mediante sync()
```

**Tipos de datos específicos:**
- **INTEGER**: IDs y números enteros
- **VARCHAR(255)**: Texto de longitud variable
- **TEXT**: Texto largo sin límite
- **DATETIME**: Fechas y horas
- **ENUM**: Valores predefinidos

**Procedimientos almacenados:**
- **Triggers**: Para auditoría y validaciones automáticas
- **Funciones**: Para cálculos y transformaciones de datos
- **Vistas**: Para consultas complejas frecuentes

### 3.5.4 Diccionario de datos

**Descripción detallada de tablas:**

**Users:**
- **id**: Identificador único del usuario (INTEGER, PK, AUTOINCREMENT)
- **name**: Nombre completo del usuario (VARCHAR(255), NOT NULL)
- **email**: Correo electrónico único (VARCHAR(255), UNIQUE, NOT NULL)
- **password**: Contraseña encriptada (VARCHAR(255), NOT NULL)
- **role**: Rol del usuario (ENUM: 'student', 'teacher', 'admin', NOT NULL)
- **studentId**: Código de estudiante único (VARCHAR(255), UNIQUE, NULL)
- **faculty**: Facultad o departamento (VARCHAR(255), NULL)

**Courses:**
- **id**: Identificador único del curso (INTEGER, PK, AUTOINCREMENT)
- **name**: Nombre del curso (VARCHAR(255), NOT NULL)
- **code**: Código único del curso (VARCHAR(255), UNIQUE, NOT NULL)
- **teacherId**: ID del profesor asignado (INTEGER, FK, NOT NULL)

**Accommodations:**
- **id**: Identificador único de la solicitud (INTEGER, PK, AUTOINCREMENT)
- **type**: Tipo de acomodación (ENUM, NOT NULL)
- **status**: Estado de la solicitud (ENUM: 'pending', 'approved', 'rejected')
- **description**: Descripción detallada (TEXT, NOT NULL)
- **motivo**: Motivo de la solicitud (TEXT, NULL)
- **requestedDate**: Fecha de la solicitud (DATETIME, NOT NULL)
- **newDate**: Nueva fecha propuesta (DATETIME, NULL)
- **newClassroom**: Nuevo aula propuesta (VARCHAR(255), NULL)
- **extensionDays**: Días de extensión (INTEGER, NULL)
- **teacherResponse**: Respuesta del profesor (TEXT, NULL)
- **studentId**: ID del estudiante (INTEGER, FK, NOT NULL)
- **courseId**: ID del curso (INTEGER, FK, NOT NULL)
- **teacherId**: ID del profesor (INTEGER, FK, NOT NULL)

**Absences:**
- **id**: Identificador único de la falta (INTEGER, PK, AUTOINCREMENT)
- **fecha**: Fecha de la falta (DATETIME, NOT NULL)
- **materia**: Materia o curso (VARCHAR(255), NOT NULL)
- **motivo**: Motivo de la falta (TEXT, NULL)
- **tipo**: Tipo de falta (ENUM: 'justificada', 'injustificada', 'prevista')
- **observaciones**: Observaciones del profesor (TEXT, NULL)
- **studentId**: ID del estudiante (INTEGER, FK, NOT NULL)
- **courseId**: ID del curso (INTEGER, FK, NOT NULL)
- **teacherId**: ID del profesor (INTEGER, FK, NOT NULL)

**Dominios y restricciones:**
- **Email**: Formato válido de correo electrónico
- **Password**: Mínimo 8 caracteres, encriptado con bcrypt
- **Role**: Valores predefinidos del sistema
- **Status**: Estados válidos del flujo de trabajo
- **Dates**: Fechas válidas y lógicas

**Relaciones y dependencias:**
- **Integridad referencial**: Todas las FK tienen restricciones
- **Cascada**: Eliminación en cascada para datos relacionados
- **Auditoría**: Campos de timestamp automáticos (createdAt, updatedAt)

## 3.6 DESARROLLO DE LA APLICACIÓN

Esta sección describe el proceso de implementación de la aplicación web, detallando las fases de codificación, la arquitectura del software y las decisiones técnicas tomadas durante el desarrollo.

### 3.6.1 Arquitectura del sistema

**Patrón arquitectónico seleccionado: Arquitectura de 3 capas (3-Tier)**

```
┌─────────────────────────────────────┐
│           PRESENTACIÓN              │
│         (Frontend - React)          │
├─────────────────────────────────────┤
│           LÓGICA DE NEGOCIO         │
│         (Backend - Express)         │
├─────────────────────────────────────┤
│            ACCESO A DATOS           │
│        (Base de Datos - SQLite)     │
└─────────────────────────────────────┘
```

**Capas de la aplicación:**

1. **Capa de Presentación (Frontend)**:
   - React.js con componentes funcionales
   - Context API para manejo de estado global
   - React Router para navegación
   - Tailwind CSS para estilos

2. **Capa de Lógica de Negocio (Backend)**:
   - Express.js como framework web
   - Middleware para autenticación y validación
   - Rutas RESTful para API endpoints
   - Sequelize ORM para abstracción de datos

3. **Capa de Acceso a Datos (Database)**:
   - SQLite como base de datos relacional
   - Modelos Sequelize para mapeo objeto-relacional
   - Migraciones automáticas

**Componentes principales:**
- **Servidor Express**: Manejo de peticiones HTTP
- **Modelos de datos**: User, Course, Accommodation, Absence
- **Rutas de API**: auth, users, courses, accommodations, absences, requests
- **Middleware**: Autenticación, CORS, validación
- **Frontend React**: Componentes de interfaz de usuario

**Diagramas de arquitectura:**
```
Cliente (Browser) → React App → Express API → SQLite Database
     ↓                ↓            ↓            ↓
  Interfaz        Componentes   Rutas API    Modelos
  de Usuario      React         Express      Sequelize
```

### 3.6.2 Estructura del proyecto

**Organización de directorios:**

```
SistemaDeSolicitudesAcademicas/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── user.model.js
│   │   │   ├── course.model.js
│   │   │   ├── accommodation.model.js
│   │   │   └── absence.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── course.routes.js
│   │   │   ├── accommodation.routes.js
│   │   │   ├── absence.routes.js
│   │   │   └── requests.routes.js
│   │   └── index.js
│   ├── scripts/
│   ├── public/
│   ├── package.json
│   └── database.sqlite
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js
    │   ├── contexts/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── SolicitudesPage.js
    │   │   ├── AbsenceManagement.js
    │   │   ├── AdminDashboard.js
    │   │   └── StudentRequests.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── public/
    ├── package.json
    └── tailwind.config.js
```

**Convenciones de nomenclatura:**
- **Archivos**: camelCase para JavaScript, kebab-case para HTML
- **Componentes**: PascalCase (ej: AdminDashboard.js)
- **Variables**: camelCase (ej: userData, requestStatus)
- **Constantes**: UPPER_SNAKE_CASE (ej: API_BASE_URL)
- **Rutas**: kebab-case (ej: /mis-solicitudes)

**Configuración del entorno:**
- **Variables de entorno**: .env para configuración sensible
- **Puertos**: Backend (5000), Frontend (3000)
- **Base de datos**: SQLite con archivo local
- **CORS**: Configurado para desarrollo local

**Gestión de dependencias:**
- **Backend**: npm con package.json
- **Frontend**: npm con package.json
- **Dependencias principales**: Express, React, Sequelize, Axios
- **Dependencias de desarrollo**: Nodemon, React Scripts

### 3.6.3 Implementación del backend

**API REST:**
```
Base URL: http://localhost:5000/api

Endpoints principales:
├── /auth
│   ├── POST /register - Registro de usuarios
│   ├── POST /login - Autenticación
│   └── GET /me - Usuario actual
├── /users
│   ├── GET / - Listar usuarios
│   ├── POST / - Crear usuario
│   ├── GET /:id - Obtener usuario
│   ├── PUT /:id - Actualizar usuario
│   └── DELETE /:id - Eliminar usuario
├── /courses
│   ├── GET / - Listar cursos
│   ├── POST / - Crear curso
│   └── GET /:id - Obtener curso
├── /accommodations
│   ├── POST / - Crear solicitud
│   ├── GET /teacher - Solicitudes del profesor
│   ├── GET /student - Solicitudes del estudiante
│   ├── PATCH /:id - Actualizar estado
│   └── DELETE /:id - Eliminar solicitud
├── /absences
│   ├── POST / - Crear falta
│   ├── GET / - Listar faltas
│   ├── PATCH /:id - Actualizar falta
│   └── DELETE /:id - Eliminar falta
└── /requests
    ├── GET /admin - Todas las solicitudes (admin)
    ├── GET /teacher - Solicitudes del profesor
    ├── GET /student - Solicitudes del estudiante
    ├── PATCH /:id/approve - Aprobar solicitud
    └── PATCH /:id/reject - Rechazar solicitud
```

**Lógica de negocio:**
- **Autenticación**: Validación de credenciales con bcrypt
- **Autorización**: Control de acceso basado en roles
- **Validación**: Middleware para validar datos de entrada
- **Transformación**: Mapeo de datos entre frontend y base de datos

**Acceso a datos:**
- **ORM**: Sequelize para abstracción de base de datos
- **Modelos**: Definición de entidades y relaciones
- **Consultas**: Métodos CRUD optimizados
- **Transacciones**: Para operaciones complejas

**Manejo de sesiones y autenticación:**
- **JWT**: Tokens para autenticación stateless
- **Middleware**: Verificación de tokens en rutas protegidas
- **Context**: Manejo de estado de usuario en frontend
- **LocalStorage**: Persistencia de sesión en cliente

### 3.6.4 Implementación del frontend

**Interfaz de usuario:**
- **Componentes**: React funcionales con hooks
- **Estado**: useState y useEffect para manejo local
- **Context**: AuthContext para estado global
- **Routing**: React Router para navegación SPA

**Consumo de servicios:**
- **HTTP Client**: Axios para peticiones API
- **Interceptors**: Para manejo automático de tokens
- **Error Handling**: Manejo centralizado de errores
- **Loading States**: Indicadores de carga

**Validaciones del lado cliente:**
- **Formularios**: Validación en tiempo real
- **Campos requeridos**: Validación de campos obligatorios
- **Formatos**: Validación de emails, fechas, etc.
- **Feedback**: Mensajes de error y éxito

**Manejo de estados:**
- **Estado local**: useState para componentes individuales
- **Estado global**: Context API para datos compartidos
- **Persistencia**: LocalStorage para datos de sesión
- **Sincronización**: Actualización automática de datos

### 3.6.5 Integración de componentes

**Comunicación frontend-backend:**
- **API REST**: Comunicación HTTP estándar
- **JSON**: Formato de intercambio de datos
- **CORS**: Configurado para desarrollo local
- **Headers**: Autenticación y content-type

**Manejo de errores:**
- **HTTP Status**: Códigos de estado estándar
- **Error Boundaries**: Captura de errores en React
- **Logging**: Registro de errores en consola
- **User Feedback**: Mensajes de error amigables

**Logging y monitoreo:**
- **Console Logs**: Para desarrollo y debugging
- **Error Tracking**: Captura de errores de JavaScript
- **Performance**: Monitoreo de tiempos de respuesta
- **Analytics**: Tracking de uso de funcionalidades

**Optimización de rendimiento:**
- **Lazy Loading**: Carga diferida de componentes
- **Memoization**: React.memo para optimización
- **Bundle Splitting**: División de código JavaScript
- **Caching**: Cache de datos en frontend

### 3.6.6 Control de versiones

**Repositorio de código:**
- **Git**: Sistema de control de versiones
- **GitHub**: Repositorio remoto
- **Branches**: Desarrollo en ramas separadas
- **Commits**: Historial detallado de cambios

**Estrategia de branching:**
- **main**: Rama principal estable
- **develop**: Rama de desarrollo
- **feature/**: Ramas para nuevas funcionalidades
- **hotfix/**: Ramas para correcciones urgentes

**Commits y documentación:**
- **Conventional Commits**: Formato estándar de commits
- **README**: Documentación del proyecto
- **Comentarios**: Código documentado
- **Changelog**: Registro de cambios

**Colaboración en equipo:**
- **Pull Requests**: Revisión de código
- **Code Review**: Revisión por pares
- **Issues**: Seguimiento de tareas y bugs
- **Wiki**: Documentación colaborativa

## 3.7 DEFINICIÓN DE LAS PRUEBAS QUE CUMPLAN CON LOS REQUERIMIENTOS

Se establecen los criterios y procedimientos de prueba para verificar que la aplicación cumple con todos los requerimientos especificados, garantizando su calidad y funcionamiento correcto.

### 3.7.1 Plan de pruebas

**Objetivos de las pruebas:**
- Verificar el cumplimiento de requerimientos funcionales
- Validar la calidad y rendimiento del sistema
- Asegurar la usabilidad y accesibilidad
- Confirmar la seguridad y protección de datos

**Alcance y limitaciones:**
- **Alcance**: Todas las funcionalidades implementadas
- **Limitaciones**: Pruebas en entorno de desarrollo
- **Exclusiones**: Pruebas de carga en producción
- **Cobertura**: 80% de código crítico

**Criterios de aceptación:**
- Todas las funcionalidades operan correctamente
- Tiempo de respuesta < 3 segundos
- Compatibilidad con navegadores principales
- Interfaz intuitiva y accesible

**Cronograma de pruebas:**
- **Semana 1-2**: Pruebas unitarias
- **Semana 3-4**: Pruebas de integración
- **Semana 5-6**: Pruebas del sistema
- **Semana 7-8**: Pruebas de aceptación

### 3.7.2 Tipos de pruebas

#### 3.7.2.1 Pruebas unitarias

**Pruebas de funciones individuales:**
- Validación de modelos de datos
- Pruebas de funciones de autenticación
- Validación de lógica de negocio
- Pruebas de utilidades y helpers

**Cobertura de código:**
- **Objetivo**: 80% de cobertura
- **Herramientas**: Jest para JavaScript
- **Métricas**: Líneas, funciones, ramas
- **Reportes**: Cobertura por archivo

**Herramientas de testing:**
- **Jest**: Framework de testing
- **Supertest**: Testing de APIs
- **React Testing Library**: Testing de componentes
- **Enzyme**: Testing de componentes React

**Casos de prueba automatizados:**
```javascript
// Ejemplo de prueba unitaria
describe('User Model', () => {
  test('should create user with valid data', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student'
    };
    
    const user = await User.create(userData);
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });
});
```

#### 3.7.2.2 Pruebas de integración

**Pruebas de módulos integrados:**
- Integración frontend-backend
- Comunicación con base de datos
- Flujo completo de solicitudes
- Autenticación y autorización

**Pruebas de API:**
- Endpoints REST
- Validación de respuestas
- Manejo de errores
- Autenticación de rutas

**Pruebas de base de datos:**
- Operaciones CRUD
- Integridad referencial
- Transacciones
- Migraciones

**Pruebas de servicios externos:**
- Integración con APIs externas
- Manejo de timeouts
- Fallback mechanisms
- Error handling

#### 3.7.2.3 Pruebas del sistema

**Pruebas funcionales completas:**
- Flujos de usuario completos
- Casos de uso principales
- Escenarios de error
- Recuperación de fallos

**Pruebas de flujos de trabajo:**
- Proceso de registro y login
- Creación de solicitudes
- Aprobación/rechazo de solicitudes
- Gestión de faltas

**Pruebas de casos de uso:**
- Estudiante crea solicitud
- Profesor revisa y responde
- Administrador gestiona sistema
- Usuario actualiza perfil

**Validación de requerimientos:**
- Cumplimiento de RF01-RF07
- Validación de RNF
- Verificación de restricciones
- Confirmación de objetivos

#### 3.7.2.4 Pruebas de aceptación

**Pruebas con usuarios finales:**
- Estudiantes reales
- Profesores del sistema
- Administradores
- Usuarios con discapacidades

**Validación de criterios de aceptación:**
- Funcionalidad completa
- Usabilidad satisfactoria
- Rendimiento aceptable
- Seguridad adecuada

**Feedback de usuarios:**
- Encuestas de satisfacción
- Entrevistas de usabilidad
- Observación directa
- Métricas de uso

**Ajustes finales:**
- Corrección de bugs críticos
- Mejoras de usabilidad
- Optimizaciones de rendimiento
- Refinamiento de interfaz

### 3.7.3 Pruebas no funcionales

#### 3.7.3.1 Pruebas de rendimiento

**Pruebas de carga:**
- 100 usuarios concurrentes
- 1000 solicitudes por hora
- Tiempo de respuesta < 3 segundos
- Uso de memoria < 512MB

**Pruebas de estrés:**
- Límites del sistema
- Comportamiento bajo carga extrema
- Recuperación de fallos
- Degradación elegante

**Pruebas de volumen:**
- 10,000 usuarios registrados
- 50,000 solicitudes históricas
- 1,000 cursos activos
- Base de datos de 1GB

**Tiempo de respuesta:**
- Páginas estáticas < 1 segundo
- Páginas dinámicas < 3 segundos
- APIs < 500ms
- Base de datos < 100ms

#### 3.7.3.2 Pruebas de seguridad

**Pruebas de vulnerabilidades:**
- Inyección SQL
- Cross-site scripting (XSS)
- Cross-site request forgery (CSRF)
- Inyección de comandos

**Pruebas de autenticación:**
- Validación de credenciales
- Manejo de sesiones
- Expiración de tokens
- Logout seguro

**Pruebas de autorización:**
- Control de acceso por roles
- Escalación de privilegios
- Acceso no autorizado
- Filtrado de datos

**Pruebas de inyección:**
- SQL injection
- NoSQL injection
- Command injection
- LDAP injection

#### 3.7.3.3 Pruebas de usabilidad

**Experiencia de usuario:**
- Navegación intuitiva
- Tiempo de aprendizaje
- Eficiencia de tareas
- Satisfacción del usuario

**Accesibilidad:**
- Estándares WCAG 2.1
- Lectores de pantalla
- Navegación por teclado
- Contraste de colores

**Compatibilidad de navegadores:**
- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

**Diseño responsivo:**
- Dispositivos móviles
- Tablets
- Desktop
- Diferentes resoluciones

### 3.7.4 Herramientas de prueba

**Frameworks de testing:**
- **Jest**: Testing de JavaScript
- **Mocha**: Framework de testing
- **Chai**: Librería de aserciones
- **Sinon**: Mocks y stubs

**Herramientas de automatización:**
- **Selenium**: Testing de UI automatizado
- **Cypress**: Testing end-to-end
- **Puppeteer**: Testing de navegador
- **Playwright**: Testing multi-navegador

**Herramientas de monitoreo:**
- **Lighthouse**: Auditoría de rendimiento
- **WebPageTest**: Análisis de velocidad
- **GTmetrix**: Métricas de rendimiento
- **Chrome DevTools**: Profiling y debugging

**Reportes de pruebas:**
- **Jest HTML Reporter**: Reportes HTML
- **Allure**: Reportes avanzados
- **Mochawesome**: Reportes visuales
- **Coverage Reports**: Reportes de cobertura

### 3.7.5 Métricas y criterios de calidad

**Indicadores de calidad:**
- **Cobertura de código**: > 80%
- **Complejidad ciclomática**: < 10
- **Duplicación de código**: < 5%
- **Mantenibilidad**: Índice > 70

**Umbrales de aceptación:**
- **Tiempo de respuesta**: < 3 segundos
- **Disponibilidad**: > 99%
- **Tasa de error**: < 1%
- **Satisfacción de usuario**: > 4/5

**Métricas de cobertura:**
- **Líneas de código**: 80%
- **Funciones**: 85%
- **Ramas**: 75%
- **Declaraciones**: 80%

**Criterios de liberación:**
- Todas las pruebas pasan
- Cobertura de código > 80%
- Sin bugs críticos
- Documentación completa

### 3.7.6 Documentación de pruebas

**Casos de prueba detallados:**
- **ID**: Identificador único
- **Descripción**: Propósito de la prueba
- **Precondiciones**: Estado inicial requerido
- **Pasos**: Secuencia de acciones
- **Resultado esperado**: Comportamiento esperado
- **Resultado actual**: Comportamiento observado

**Resultados de ejecución:**
- **Estado**: Pass/Fail/Skip
- **Tiempo de ejecución**: Duración de la prueba
- **Logs**: Registros de ejecución
- **Screenshots**: Evidencia visual

**Reportes de defectos:**
- **Severidad**: Crítico/Alto/Medio/Bajo
- **Prioridad**: P1/P2/P3/P4
- **Estado**: Abierto/En progreso/Cerrado
- **Asignado**: Responsable de corrección

**Evidencias de prueba:**
- **Screenshots**: Capturas de pantalla
- **Videos**: Grabaciones de sesiones
- **Logs**: Archivos de registro
- **Datos**: Datos de prueba utilizados
