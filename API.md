# 📚 Documentación de API

## 🔐 Autenticación

Todas las rutas protegidas requieren el header:
```
Authorization: Bearer TOKEN_JWT
```

---

## 🔑 AUTH - `/api/auth`

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@ucol.mx",
  "password": "Admin123!"
}
```

**Respuesta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Administrador Principal",
    "email": "admin@ucol.mx",
    "role": "admin"
  }
}
```

### Registro (Solo Admin)
```http
POST /api/auth/register
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "jperez@ucol.mx",
  "password": "User123!",
  "role": "student",
  "studentId": "20231001",
  "faculty": "Telemática"
}
```

---

## 👥 USERS - `/api/users`

### Listar todos los usuarios (Admin)
```http
GET /api/users
Authorization: Bearer TOKEN_ADMIN
```

### Ver usuario por ID
```http
GET /api/users/:id
Authorization: Bearer TOKEN
```

### Crear usuario (Admin)
```http
POST /api/users
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "María González",
  "email": "mgonzalez@ucol.mx",
  "password": "Profesor123!",
  "role": "teacher",
  "faculty": "Ingeniería"
}
```

### Actualizar usuario
```http
PUT /api/users/:id
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Nombre Actualizado",
  "email": "nuevo@ucol.mx"
}
```

### Eliminar usuario (Admin)
```http
DELETE /api/users/:id
Authorization: Bearer TOKEN_ADMIN
```

---

## 📚 COURSES - `/api/courses`

### Listar todos los cursos
```http
GET /api/courses
Authorization: Bearer TOKEN
```

### Ver curso por ID
```http
GET /api/courses/:id
Authorization: Bearer TOKEN
```

### Crear curso (Admin)
```http
POST /api/courses
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Programación Web",
  "code": "TEL101",
  "description": "Desarrollo de aplicaciones web",
  "schedule": "Lunes y Miércoles 10:00-12:00",
  "classroom": "Lab 3",
  "teacherId": 3
}
```

### Cursos por profesor
```http
GET /api/courses/teacher/:teacherId
Authorization: Bearer TOKEN
```

### Cursos del estudiante
```http
GET /api/courses/student
Authorization: Bearer TOKEN_STUDENT
```

### Actualizar curso (Admin)
```http
PUT /api/courses/:id
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Nombre Actualizado",
  "schedule": "Martes 14:00-16:00"
}
```

### Eliminar curso (Admin)
```http
DELETE /api/courses/:id
Authorization: Bearer TOKEN_ADMIN
```

---

## 🎓 ENROLLMENTS - `/api/enrollments`

### Inscribir estudiante a curso (Admin/Profesor)
```http
POST /api/enrollments
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "studentId": 2,
  "courseId": 1
}
```

### Ver cursos de un estudiante
```http
GET /api/enrollments/student/:studentId
Authorization: Bearer TOKEN
```

### Ver estudiantes de un curso (Profesor/Admin)
```http
GET /api/enrollments/course/:courseId
Authorization: Bearer TOKEN_TEACHER
```

### Desinscribir estudiante (Admin/Profesor)
```http
DELETE /api/enrollments/:id
Authorization: Bearer TOKEN_ADMIN
```

---

## 🏫 FACULTIES - `/api/faculties`

### Listar todas las facultades (Público)
```http
GET /api/faculties
```

### Ver facultad por ID (Público)
```http
GET /api/faculties/:id
```

### Crear facultad (Admin)
```http
POST /api/faculties
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Telemática",
  "description": "Facultad de Telemática"
}
```

### Actualizar facultad (Admin)
```http
PUT /api/faculties/:id
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "name": "Nombre Actualizado",
  "description": "Nueva descripción"
}
```

### Eliminar facultad (Admin)
```http
DELETE /api/faculties/:id
Authorization: Bearer TOKEN_ADMIN
```

---

## ♿ ACCOMMODATIONS - `/api/accommodations`

### Crear solicitud de acomodación (Estudiante)
```http
POST /api/accommodations
Authorization: Bearer TOKEN_STUDENT
Content-Type: application/json

{
  "type": "exam_date_change",
  "description": "Necesito cambiar fecha de examen por motivos médicos",
  "courseId": 1,
  "requestedDate": "2025-11-25",
  "newDate": "2025-11-30",
  "motivo": "Cita médica"
}
```

**Tipos disponibles:**
- `exam_date_change`
- `classroom_change`
- `notes_request`
- `assignment_extension`
- `deadline_extension`
- `exam_change`
- `absence_notification`

### Ver solicitudes del profesor
```http
GET /api/accommodations/teacher
Authorization: Bearer TOKEN_TEACHER
```

### Ver solicitudes del estudiante
```http
GET /api/accommodations/student
Authorization: Bearer TOKEN_STUDENT
```

### Ver solicitud por ID
```http
GET /api/accommodations/:id
Authorization: Bearer TOKEN
```

### Actualizar estado de solicitud (Profesor/Admin)
```http
PATCH /api/accommodations/:id
Authorization: Bearer TOKEN_TEACHER
Content-Type: application/json

{
  "status": "approved",
  "teacherResponse": "Aprobado. Por favor presenta tu comprobante médico."
}
```

**Estados disponibles:**
- `pending`
- `approved`
- `rejected`

### Eliminar solicitud
```http
DELETE /api/accommodations/:id
Authorization: Bearer TOKEN
```

---

## 📝 ABSENCES - `/api/absences`

### Registrar ausencia (Profesor/Admin)
```http
POST /api/absences
Authorization: Bearer TOKEN_TEACHER
Content-Type: application/json

{
  "studentId": 2,
  "courseId": 1,
  "fecha": "2025-11-23",
  "materia": "Programación Web",
  "motivo": "Enfermedad",
  "tipo": "justificada",
  "observaciones": "Presentó comprobante médico"
}
```

**Tipos disponibles:**
- `justificada`
- `injustificada`
- `prevista`

### Ver ausencias del estudiante
```http
GET /api/absences/student
Authorization: Bearer TOKEN_STUDENT
```

### Ver ausencias registradas por profesor
```http
GET /api/absences/teacher
Authorization: Bearer TOKEN_TEACHER
```

### Eliminar ausencia (Profesor/Admin)
```http
DELETE /api/absences/:id
Authorization: Bearer TOKEN_TEACHER
```

---

## 📊 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado exitosamente |
| `204` | No Content - Eliminado exitosamente |
| `400` | Bad Request - Datos inválidos |
| `401` | Unauthorized - No autenticado |
| `403` | Forbidden - No autorizado |
| `404` | Not Found - Recurso no encontrado |
| `500` | Internal Server Error - Error del servidor |

---

## 🔐 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Admin** | Acceso total al sistema |
| **Teacher** | Gestionar sus cursos, registrar ausencias, aprobar/rechazar acomodaciones |
| **Student** | Ver sus cursos, crear solicitudes de acomodación, ver sus ausencias |

---

## 💡 Ejemplos de Uso

### Flujo completo: Crear estudiante e inscribirlo a un curso

```bash
# 1. Login como admin
POST /api/auth/login
{ "email": "admin@ucol.mx", "password": "Admin123!" }

# 2. Crear estudiante
POST /api/users
{ "name": "Juan Pérez", "email": "jperez@ucol.mx", "password": "User123!", "role": "student", "studentId": "20231001" }

# 3. Inscribir a curso
POST /api/enrollments
{ "studentId": 2, "courseId": 1 }

# 4. Verificar inscripción
GET /api/enrollments/student/2
```

### Flujo: Estudiante solicita acomodación

```bash
# 1. Login como estudiante
POST /api/auth/login
{ "email": "jperez@ucol.mx", "password": "User123!" }

# 2. Ver cursos disponibles
GET /api/enrollments/student/2

# 3. Crear solicitud
POST /api/accommodations
{ "type": "exam_date_change", "courseId": 1, "description": "...", "requestedDate": "2025-11-25" }

# 4. Ver estado de solicitudes
GET /api/accommodations/student
```