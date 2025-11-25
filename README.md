# Sistema de Acomodaciones para Estudiantes Neurodiversos

Este sistema permite gestionar las acomodaciones y solicitudes especiales para estudiantes neurodiversos, facilitando la comunicación entre estudiantes, profesores y administradores.

## Características Principales

- Gestión de solicitudes de acomodaciones
- Sistema de roles (Estudiantes, Profesores, Administradores)
- Solicitudes de cambio de fecha de exámenes
- Solicitudes de cambio de salón
- Solicitud de apuntes
- Extensiones de entrega de trabajos
- Sistema de comentarios y respuestas

## Tecnologías Utilizadas

### Frontend
- React.js
- React Router
- Axios

### Modo Oscuro (Accesibilidad)
Se implementó soporte para modo claro/oscuro respetando criterios WCAG AA:
- Activación manual con el botón en la barra de navegación (persistido en `localStorage`).
- Detección inicial de preferencia del sistema (`prefers-color-scheme`).
- Uso de `darkMode: 'class'` en Tailwind y variables CSS (`--color-*`) para consistencia.
- Contrastes de texto vs fondo ≥ 4.5:1 para texto normal y ≥ 3:1 para elementos grandes.

Para añadir soporte oscuro en nuevos componentes:
1. Usar clases Tailwind con prefijo `dark:` (ej. `bg-white dark:bg-gray-800`).
2. Preferir variables: `.bg-app`, `.text-app`, `.text-app-muted`, `.card` ya están preparadas.
3. Verificar contraste rápido con herramientas como: WebAIM Contrast Checker / DevTools Accessibility.
4. Evitar puro #000/#fff en grandes áreas (reduce fatiga visual), usar escalas neutras.

Paleta oscura base:
| Propósito | Color |
|-----------|-------|
| Fondo base | `#0f141a` |
| Superficie | `#1e2933` |
| Texto principal | `#f1f5f9` |
| Texto secundario | `#cbd5e1` |
| Borde | `#2f3c48` |
| Primario | `#38bdf8` |

Si necesitas extender la paleta, mantener diferencia de luminancia suficiente y comprobar estados hover/focus.

### Backend
- Node.js
- Express
- Sequelize
- SQLite
- CORS

## Configuración del Proyecto

### Requisitos Previos
- Node.js (v14 o superior)
- npm o yarn

## Estructura

```
backend/    -> API Express + Sequelize (SQLite por defecto)
frontend/   -> React + Tailwind (modo oscuro accesible)
Maquetado/  -> Documentos de diseño y modelo de datos
```

## 🚀 Backend (API)

1. Clonar el repositorio
2. Instalar dependencias en `backend`:
   ```bash
   cd backend
   npm install
   ```
3. Crear archivo `.env` si aplica (opcional si usas SQLite simple). Variables típicas:
   - `DB_DIALECT=sqlite`
   - `DB_STORAGE=database.sqlite`
   - `JWT_SECRET=<cadena_segura>` (genera uno):
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
4. Poblar base y crear usuario admin:
   ```bash
   node seedDatabase.js
   ```
5. Iniciar servidor (puerto por defecto 5000):
   ```bash
   npm start
   ```

### 🔑 Credenciales por defecto

Admin inicial:
- Email: `admin@ucol.mx`
- Password: `Admin123!`

## 💻 Frontend (React)

1. Instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```
2. Ejecutar en modo desarrollo (puerto por defecto 3000):
   ```bash
   npm start
   ```
3. Asegúrate de que el backend esté en `http://localhost:5000`. Si necesitas cambiarlo, ajusta `frontend/src/services/api.js` (BASE_URL) o crea una variable de entorno y lee desde allí.

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