# Sistema de Solicitudes de Acomodaciones Académicas

Sistema web completo para gestionar solicitudes de acomodaciones académicas y control de faltas, facilitando la comunicación entre estudiantes, profesores y administradores.

## ✨ Características Principales

### 🎓 Para Estudiantes
- Crear solicitudes de acomodación académica (cambio de fecha de examen, extensión de entrega)
- Ver estado de solicitudes enviadas con estadísticas visuales
- Registrar y justificar faltas con carga de evidencia (PDF/PNG)
- Dashboard personalizado con información académica

### 👨‍🏫 Para Profesores
- Panel de gestión con estadísticas (Total, Pendientes, Aprobadas, Rechazadas)
- Aprobar o rechazar solicitudes con respuesta personalizada
- Revisar faltas notificadas por estudiantes con evidencias adjuntas
- Sistema de filtrado por estado mediante tabs

### 👤 Para Administradores
- Gestión completa de usuarios (crear, editar, eliminar)
- Administración de cursos y facultades
- Sistema de inscripción de estudiantes a cursos
- Panel super admin con control total del sistema

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de UI con hooks
- **React Router v6** - Navegación SPA
- **Axios** - Cliente HTTP para API
- **Tailwind CSS** - Framework de estilos con utilidades
- **Context API** - Gestión de estado (Auth y Theme)

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **Sequelize** - ORM para bases de datos
- **SQLite3** - Base de datos embebida (desarrollo)
- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **bcryptjs** - Hash de contraseñas
- **Multer** - Manejo de archivos multipart/form-data
- **CORS** - Permisos de origen cruzado

### 🌓 Modo Oscuro y Accesibilidad
Sistema completo de temas con soporte WCAG AA:
- **Activación manual** con botón en navbar (persistido en `localStorage`)
- **Detección automática** de preferencia del sistema (`prefers-color-scheme`)
- **Tailwind Dark Mode** configurado con estrategia `class`
- **Variables CSS personalizadas** para colores base (`--color-*`)
- **Contraste verificado**: ≥ 4.5:1 para texto, ≥ 3:1 para elementos grandes

#### Paleta de Colores Oscuros
| Elemento | Color | Propósito |
|----------|-------|-----------|
| Fondo base | `#0f141a` | Background principal |
| Superficie | `#1e2933` | Cards y paneles |
| Texto principal | `#f1f5f9` | Contenido legible |
| Texto secundario | `#cbd5e1` | Información auxiliar |
| Borde | `#2f3c48` | Separadores sutiles |
| Primario | `#38bdf8` | Acciones principales |

#### Componentes Reutilizables con Dark Mode
```css
.bg-app          /* Fondo adaptable */
.text-app        /* Texto principal */
.text-app-muted  /* Texto secundario */
.card            /* Tarjetas con sombra */
.btn             /* Botones base */
.btn-primary     /* Botón primario */
.btn-secondary   /* Botón secundario */
.input           /* Campos de entrada */
```

### Backend
- Node.js
- Express
- Sequelize
- SQLite
- CORS

## 📋 Requisitos Previos
- **Node.js** v14 o superior
- **npm** o **yarn**
- **Git** (para clonar el repositorio)

## 📁 Estructura del Proyecto

```
SistemaDeSolicitudesAcademicas/
├── backend/              # API REST con Express
│   ├── src/
│   │   ├── config/      # Configuración de BD
│   │   ├── middleware/  # Auth y upload middleware
│   │   ├── models/      # Modelos Sequelize
│   │   └── routes/      # Endpoints API
│   ├── uploads/         # Archivos subidos (evidencias)
│   ├── database.sqlite  # BD SQLite (generada)
│   ├── seedDatabase.js  # Script de población inicial
│   └── package.json
│
├── frontend/            # Aplicación React
│   ├── src/
│   │   ├── components/  # Componentes reutilizables
│   │   ├── contexts/    # AuthContext y ThemeContext
│   │   ├── pages/       # Vistas principales
│   │   ├── services/    # Cliente API (axios)
│   │   ├── App.js
│   │   └── index.css    # Estilos globales + Tailwind
│   └── package.json
│
└── Maquetado/           # Documentación de diseño
    ├── 3.3_MAPA_NAVEGACION_ARQUITECTURA_INFORMACION.md
    ├── 3.4_MAQUETACION.md
    ├── 3.5_MODELO_DATOS.md
    └── 3.5.3_MODELO_FISICO.md
```

## 🚀 Instalación y Configuración

### 🔧 Backend (API)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/SistemaDeSolicitudesAcademicas.git
   cd SistemaDeSolicitudesAcademicas
   ```

2. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configurar variables de entorno (opcional)**
   
   Crear archivo `.env` en `backend/` con:
   ```env
   PORT=5000
   JWT_SECRET=tu_clave_secreta_super_segura
   DB_DIALECT=sqlite
   DB_STORAGE=database.sqlite
   BCRYPT_SALT_ROUNDS=10
   ```
   
   Para generar un JWT_SECRET seguro:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Inicializar base de datos y crear usuario admin**
   ```bash
   node seedDatabase.js
   ```
   
   Esto creará:
   - Estructura de tablas (Users, Courses, Enrollments, Accommodations, Absences, Faculties)
   - Usuario administrador por defecto
   - Datos de ejemplo (opcional)

5. **Iniciar servidor backend**
   ```bash
   npm start
   ```
   
   El servidor correrá en `http://localhost:5000`

### 🔑 Credenciales de Acceso Inicial

**Usuario Administrador:**
- Email: `admin@ucol.mx`
- Contraseña: `Admin123!`

> ⚠️ **Importante:** Cambia estas credenciales después del primer login

### 💻 Frontend (React)

1. **Instalar dependencias**
   ```bash
   cd frontend
   npm install
   ```

2. **Configurar URL del backend** (si es diferente a `http://localhost:5000`)
   
   Editar `frontend/src/services/api.js`:
   ```javascript
   const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   ```

3. **Iniciar aplicación en modo desarrollo**
   ```bash
   npm start
   ```
   
   La aplicación se abrirá en `http://localhost:3000`

## 🎯 Uso del Sistema

### Flujo Básico

1. **Login** - Acceder con credenciales según rol
2. **Dashboard** - Vista personalizada con tarjetas de navegación
3. **Solicitudes** 
   - Estudiantes: Crear nueva solicitud con validación de fechas
   - Profesores: Revisar y aprobar/rechazar con estadísticas
4. **Gestión de Faltas**
   - Estudiantes: Notificar falta futura con evidencia opcional
   - Profesores: Revisar faltas y marcar como justificadas/injustificadas
5. **Panel Admin** - Gestión de usuarios, cursos e inscripciones

### Tipos de Solicitudes de Acomodación

| Tipo | Descripción |
|------|-------------|
| **Cambio de Fecha de Examen** | Solicitar reprogramación de examen |
| **Extensión de Entrega** | Solicitar más tiempo para entregar trabajos |

### Validaciones Implementadas

- ❌ No se permiten fechas pasadas (excepto hoy para notificaciones)
- ❌ No se permiten fines de semana para exámenes
- ❌ Fechas propuestas deben estar en la misma semana
- ✅ Carga de evidencia en PDF o PNG (máx. 5MB)
- ✅ Descripción obligatoria con motivo detallado

## 🌓 Modo Oscuro y Accesibilidad (Resumen para Presentación)

Puntos clave a mostrar:
1. Toggle tema persistente (Contexto + `localStorage` + detección inicial `prefers-color-scheme`).
2. Clase global `.dark` (Tailwind `darkMode: 'class'`).
3. Variables CSS para colores base: un solo cambio refresca toda la UI.
4. Componentes reutilizables: `.card`, `.btn`, `.btn-primary`, `.btn-secondary`, `.input`.
5. Contraste verificado (texto principal ≥ 4.5:1, badges con colores saturados sólo en pequeñas áreas).
6. Semántica y accesibilidad: landmark `<main id="main-content">`, skip link, `aria-current` en navegación, reducción de enlaces redundantes en dashboard (solo “Inicio”) para enfoque.
7. Estados de solicitudes y faltas con colores consistentes (Pendiente = amarillo, Aprobada/Justificada = verde, Rechazada/Injustificada = rojo).

Guía al crear nuevos componentes:
```text
Usar wrapper .card para fondo y padding consistente.
Usar .btn/.btn-primary para acciones; añadir iconos SVG dentro.
Aplicar clases dark: en casos especiales donde el color de icono o fondo cambie (bg-white dark:bg-gray-800).
Preferir variables de texto: text-app / text-app-muted.
Verificar foco con tab: todos los elementos interactivos mantienen anillo.
```

## 🧪 Pruebas Manuales Rápidas
1. Login como estudiante, crear solicitud y verla actualizada en “Mis Solicitudes”.
2. Login como profesor, revisar solicitudes pendientes y aprobar una; recargar lista.
3. Estudiante registra falta futura; profesor la marca justificada.
4. Cambiar tema (claro/oscuro) y verificar que cartas, modales y tablas mantienen contraste.
5. Admin crea usuario nuevo y luego lo edita.

## 📚 API
Ver archivo `API.md` (si existe) o inspeccionar rutas en `backend/src/routes/*`.

## ✅ Checklist de Presentación
- [x] Modo oscuro integral y consistente
- [x] Contraste WCAG AA
- [x] Roles funcionales (estudiante, profesor, admin)
- [x] Solicitudes y faltas con flujo completo
- [x] Panel admin y super admin estilizados
- [x] Navegación simplificada sin pérdida de funcionalidad
- [x] Documentación mínima para ejecutar

## 📦 Futuras Mejoras (Opcional)
- Live regions para notificaciones (aprobada / rechazada) sin usar `alert`.
- Debounce y búsqueda en tablas admin.
- Test unitarios (Jest) para adaptadores de solicitudes.
- Internacionalización (i18n) para textos estáticos.