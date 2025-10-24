# DIAGRAMAS DE ARQUITECTURA Y MODELO DE DATOS

## Diagrama de Arquitectura de Navegación

```mermaid
graph TD
    A[Usuario] --> B{Autenticación}
    B -->|Login Exitoso| C[Dashboard]
    B -->|Login Fallido| D[Página de Login]
    
    C --> E{Verificar Rol}
    E -->|Estudiante| F[Dashboard Estudiante]
    E -->|Profesor| G[Dashboard Profesor]
    E -->|Admin| H[Dashboard Admin]
    
    F --> I[Solicitudes]
    F --> J[Faltas]
    F --> K[Mis Solicitudes]
    
    G --> L[Solicitudes]
    G --> M[Faltas]
    G --> N[Administración]
    
    H --> O[Solicitudes]
    H --> P[Faltas]
    H --> Q[Panel Admin]
    
    I --> R[Nueva Solicitud]
    I --> S[Ver Solicitudes]
    
    L --> T[Gestionar Solicitudes]
    L --> U[Aprobar/Rechazar]
    
    O --> V[Gestión Global]
    O --> W[Reportes]
```

## Diagrama de Flujo de Usuario - Estudiante

```mermaid
flowchart TD
    A[Estudiante accede al sistema] --> B[Login]
    B --> C[Dashboard Personal]
    C --> D{Acción deseada}
    
    D -->|Crear solicitud| E[Formulario Nueva Solicitud]
    D -->|Ver mis solicitudes| F[Lista Mis Solicitudes]
    D -->|Consultar faltas| G[Consulta de Faltas]
    
    E --> H[Seleccionar tipo de solicitud]
    H --> I[Completar formulario]
    I --> J[Enviar solicitud]
    J --> K[Confirmación]
    K --> C
    
    F --> L[Ver estado de solicitudes]
    L --> M[Detalles de solicitud]
    M --> C
    
    G --> N[Ver faltas registradas]
    N --> O[Justificar falta si aplica]
    O --> C
```

## Diagrama de Flujo de Usuario - Profesor

```mermaid
flowchart TD
    A[Profesor accede al sistema] --> B[Login]
    B --> C[Dashboard Profesor]
    C --> D{Acción deseada}
    
    D -->|Revisar solicitudes| E[Lista Solicitudes Pendientes]
    D -->|Registrar falta| F[Formulario Nueva Falta]
    D -->|Administrar cursos| G[Gestión de Cursos]
    
    E --> H[Seleccionar solicitud]
    H --> I[Revisar detalles]
    I --> J{Decisión}
    J -->|Aprobar| K[Aprobar solicitud]
    J -->|Rechazar| L[Rechazar solicitud]
    K --> M[Notificar estudiante]
    L --> M
    M --> C
    
    F --> N[Seleccionar estudiante]
    N --> O[Completar datos de falta]
    O --> P[Registrar falta]
    P --> C
    
    G --> Q[Ver cursos asignados]
    Q --> R[Gestionar información]
    R --> C
```

## Diagrama de Flujo de Usuario - Administrador

```mermaid
flowchart TD
    A[Admin accede al sistema] --> B[Login]
    B --> C[Dashboard Administrativo]
    C --> D{Acción deseada}
    
    D -->|Gestionar usuarios| E[Panel de Usuarios]
    D -->|Gestionar cursos| F[Panel de Cursos]
    D -->|Ver reportes| G[Panel de Reportes]
    D -->|Configurar sistema| H[Configuración]
    
    E --> I[Crear/Editar usuarios]
    E --> J[Asignar roles]
    E --> K[Gestionar permisos]
    
    F --> L[Crear/Editar cursos]
    F --> M[Asignar profesores]
    F --> N[Gestionar horarios]
    
    G --> O[Estadísticas generales]
    G --> P[Reportes por período]
    G --> Q[Exportar datos]
    
    H --> R[Configurar parámetros]
    H --> S[Gestionar notificaciones]
    H --> T[Configurar integraciones]
```

## Diagrama de Modelo de Datos (ER)

```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email UK
        string password
        enum role
        string studentId UK
        string faculty
        datetime createdAt
        datetime updatedAt
    }
    
    COURSE {
        int id PK
        string name
        string code UK
        text description
        string schedule
        string classroom
        int teacherId FK
        datetime createdAt
        datetime updatedAt
    }
    
    ACCOMMODATION {
        int id PK
        enum type
        enum status
        text description
        text motivo
        datetime requestedDate
        datetime newDate
        datetime fechaOriginal
        datetime fechaPropuesta
        string newClassroom
        int extensionDays
        text teacherResponse
        int studentId FK
        int courseId FK
        int teacherId FK
        datetime createdAt
        datetime updatedAt
    }
    
    ABSENCE {
        int id PK
        datetime fecha
        string materia
        text motivo
        enum tipo
        text observaciones
        int studentId FK
        int courseId FK
        int teacherId FK
        datetime createdAt
        datetime updatedAt
    }
    
    USER ||--o{ COURSE : "teaches"
    USER ||--o{ ACCOMMODATION : "requests"
    USER ||--o{ ACCOMMODATION : "receives"
    USER ||--o{ ABSENCE : "has"
    USER ||--o{ ABSENCE : "records"
    COURSE ||--o{ ACCOMMODATION : "has"
    COURSE ||--o{ ABSENCE : "has"
```

## Diagrama de Arquitectura del Sistema

```mermaid
graph TB
    subgraph "Frontend (React)"
        A[Login Component]
        B[Dashboard Component]
        C[Solicitudes Component]
        D[Faltas Component]
        E[Admin Component]
        F[Navbar Component]
    end
    
    subgraph "Backend (Node.js/Express)"
        G[Auth Routes]
        H[User Routes]
        I[Course Routes]
        J[Accommodation Routes]
        K[Absence Routes]
        L[Request Routes]
    end
    
    subgraph "Base de Datos (SQLite)"
        M[(Users Table)]
        N[(Courses Table)]
        O[(Accommodations Table)]
        P[(Absences Table)]
    end
    
    subgraph "Middleware"
        Q[Auth Middleware]
        R[CORS Middleware]
        S[Validation Middleware]
    end
    
    A --> G
    B --> H
    C --> J
    D --> K
    E --> L
    F --> Q
    
    G --> Q
    H --> Q
    I --> Q
    J --> Q
    K --> Q
    L --> Q
    
    Q --> M
    H --> M
    I --> N
    J --> O
    K --> P
    L --> O
    L --> P
```

## Diagrama de Flujo de Datos - Solicitud de Acomodación

```mermaid
sequenceDiagram
    participant E as Estudiante
    participant F as Frontend
    participant B as Backend
    participant D as Database
    participant P as Profesor
    
    E->>F: Accede a nueva solicitud
    F->>B: GET /api/courses (cursos disponibles)
    B->>D: SELECT courses WHERE teacherId = user.id
    D-->>B: Lista de cursos
    B-->>F: Cursos disponibles
    F-->>E: Muestra formulario
    
    E->>F: Completa formulario
    F->>B: POST /api/accommodations
    B->>B: Validar datos
    B->>D: INSERT INTO accommodations
    D-->>B: Solicitud creada
    B-->>F: Confirmación
    F-->>E: Solicitud enviada
    
    Note over P: Profesor recibe notificación
    P->>F: Accede a solicitudes pendientes
    F->>B: GET /api/accommodations/pending
    B->>D: SELECT accommodations WHERE status = 'pending'
    D-->>B: Solicitudes pendientes
    B-->>F: Lista de solicitudes
    F-->>P: Muestra solicitudes
    
    P->>F: Aprobar/Rechazar solicitud
    F->>B: PUT /api/accommodations/:id
    B->>D: UPDATE accommodations SET status = 'approved'
    D-->>B: Estado actualizado
    B-->>F: Solicitud actualizada
    F-->>P: Confirmación
    
    Note over E: Estudiante recibe notificación
    E->>F: Ver mis solicitudes
    F->>B: GET /api/accommodations/student
    B->>D: SELECT accommodations WHERE studentId = user.id
    D-->>B: Solicitudes del estudiante
    B-->>F: Lista actualizada
    F-->>E: Estado actualizado
```

## Diagrama de Componentes Frontend

```mermaid
graph TD
    A[App.js] --> B[AuthContext]
    A --> C[Router]
    
    C --> D[Login]
    C --> E[Register]
    C --> F[PrivateRoute]
    
    F --> G[Navbar]
    F --> H[Dashboard]
    F --> I[SolicitudesPage]
    F --> J[AbsenceManagement]
    F --> K[AdminPanel]
    F --> L[StudentRequests]
    
    G --> M[Navigation Items]
    G --> N[User Menu]
    
    H --> O[Statistics Cards]
    H --> P[Recent Activity]
    
    I --> Q[Request List]
    I --> R[New Request Form]
    I --> S[Request Details]
    
    J --> T[Absence List]
    J --> U[New Absence Form]
    J --> V[Absence Details]
    
    K --> W[User Management]
    K --> X[Course Management]
    K --> Y[System Reports]
    
    L --> Z[Student Request List]
    L --> AA[Request Status]
```

## Diagrama de Estados de Solicitud

```mermaid
stateDiagram-v2
    [*] --> Pending: Estudiante crea solicitud
    Pending --> Approved: Profesor aprueba
    Pending --> Rejected: Profesor rechaza
    Approved --> Completed: Solicitud procesada
    Rejected --> [*]: Solicitud finalizada
    Completed --> [*]: Solicitud finalizada
    
    note right of Pending
        Estado inicial
        Requiere acción del profesor
    end note
    
    note right of Approved
        Solicitud aceptada
        Se puede procesar
    end note
    
    note right of Rejected
        Solicitud denegada
        No se puede procesar
    end note
```

## Diagrama de Roles y Permisos

```mermaid
graph LR
    subgraph "Roles del Sistema"
        A[Estudiante]
        B[Profesor]
        C[Administrador]
    end
    
    subgraph "Permisos de Estudiante"
        D[Crear solicitudes]
        E[Ver sus solicitudes]
        F[Consultar faltas]
        G[Justificar faltas]
    end
    
    subgraph "Permisos de Profesor"
        H[Ver solicitudes de sus cursos]
        I[Aprobar/Rechazar solicitudes]
        J[Registrar faltas]
        K[Gestionar sus cursos]
    end
    
    subgraph "Permisos de Administrador"
        L[Gestionar usuarios]
        M[Gestionar cursos]
        N[Ver todas las solicitudes]
        O[Generar reportes]
        P[Configurar sistema]
    end
    
    A --> D
    A --> E
    A --> F
    A --> G
    
    B --> H
    B --> I
    B --> J
    B --> K
    
    C --> L
    C --> M
    C --> N
    C --> O
    C --> P
```

Estos diagramas proporcionan una representación visual completa de la arquitectura de navegación, el modelo de datos, los flujos de usuario y la estructura del sistema del Sistema de Solicitudes Académicas.

