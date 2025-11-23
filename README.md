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

# Sistema de Solicitudes Académicas - Backend

## 🚀 Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

4. Configurar variables de entorno en `.env`:
   - `DB_*`: Configuración de base de datos
   - `JWT_SECRET`: Generar uno nuevo con:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. Crear base de datos y admin:
```bash
node seedDatabase.js
```

6. Iniciar servidor:
```bash
npm start
```

## 🔑 Credenciales por defecto

**Admin:**
- Email: `admin@ucol.mx`
- Password: `Admin123!`

## 📚 Documentación API

Ver archivo `API.md` para endpoints disponibles.