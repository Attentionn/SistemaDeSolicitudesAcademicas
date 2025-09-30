# Scripts de Usuario

Este directorio contiene scripts para gestionar usuarios en la base de datos SQLite del sistema de solicitudes académicas.

## Scripts Disponibles

### 1. addUser.js - Añadir Usuario Interactivo

Script interactivo para añadir usuarios manualmente a través de la línea de comandos.

**Uso:**
```bash
npm run add-user
```

**Características:**
- Interfaz interactiva paso a paso
- Validación de datos (email, contraseña, rol)
- Verificación de emails duplicados
- Encriptación automática de contraseñas
- Posibilidad de añadir múltiples usuarios en una sesión

**Campos solicitados:**
- Nombre completo (obligatorio)
- Email (obligatorio, debe ser válido y único)
- Contraseña (obligatorio, mínimo 6 caracteres)
- Rol (student/teacher/admin)
- ID de estudiante (opcional)
- Facultad (opcional)

### 2. seedUsers.js - Usuarios de Ejemplo

Script para crear usuarios de ejemplo predefinidos en la base de datos.

**Uso:**
```bash
npm run seed-users
```

**Usuarios incluidos:**
- Admin Principal (admin@ucol.mx) - Psicología
- Profesor Juan Pérez (juan.perez@ucol.mx) - Telemática
- María García - Estudiante (maria.garcia@ucol.mx) - Psicología
- Carlos López - Estudiante (carlos.lopez@ucol.mx) - Telemática
- Ana Martínez - Estudiante (ana.martinez@ucol.mx) - Ciencias de la Educación

**Contraseñas por defecto:**
- Admin: `admin123`
- Profesor: `profesor123`
- Estudiantes: `estudiante123`

## Estructura de la Base de Datos

La tabla `Users` contiene los siguientes campos:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INTEGER | ID único autoincremental |
| name | STRING | Nombre completo del usuario |
| email | STRING | Email único del usuario |
| password | STRING | Contraseña encriptada con bcrypt |
| role | ENUM | Rol: 'student', 'teacher', 'admin' |
| studentId | STRING | ID de estudiante (opcional, único) |
| faculty | STRING | Facultad (opcional) |

## Notas Importantes

1. **Seguridad**: Las contraseñas se encriptan automáticamente usando bcrypt con salt de 10 rondas.

2. **Validaciones**: 
   - Email debe ser único y válido
   - Contraseña mínimo 6 caracteres
   - Rol debe ser uno de los valores permitidos
   - studentId debe ser único si se proporciona

3. **Base de Datos**: Los scripts se conectan automáticamente a la base de datos SQLite ubicada en `../database.sqlite`.

4. **Manejo de Errores**: Los scripts incluyen manejo robusto de errores y validaciones.

## Ejemplos de Uso

### Añadir un usuario administrador:
```bash
npm run add-user
# Seguir las instrucciones en pantalla
```

### Crear usuarios de ejemplo:
```bash
npm run seed-users
```

### Usar los scripts programáticamente:
```javascript
const { addUserWithData } = require('./scripts/addUser');

const userData = {
  name: 'Nuevo Usuario',
  email: 'nuevo@ucol.mx',
  password: 'password123',
  role: 'student',
  studentId: '2024004',
  faculty: 'Psicología' // Opciones: Psicología, Telemática, Ciencias de la Educación
};

addUserWithData(userData);
```
