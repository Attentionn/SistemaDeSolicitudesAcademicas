
http://localhost:5000/api/auth/login

{
  "email": "admin@ucol.mx",
  "password": "Admin123!"
}



{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkB1Y29sLm14Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYzODAxOTk5LCJleHAiOjE3NjM4ODgzOTl9.J5tHEY5dfJ6KjJBB_MM86y9yXKvRNyRl79iQKtdGmaM",
    "user": {
        "id": 1,
        "name": "Administrador Principal",
        "email": "admin@ucol.mx",
        "role": "admin",
        "studentId": null,
        "faculty": null
    }
}



CREAR ALUMNO
POST /api/auth/register

{
  "name": "Dario Nunez",
  "email": "daceves0@ucol.mx",
  "password": "testing123!",
  "role": "admin/teacher/student",
  "studentId": "20195865", // solo para estudiantes
  "faculty": "Facultad de Telematica" // solo para estudiantes/profesores
}



CREAR CURSO
POST /api/courses
Headers: Authorization: Bearer <token_admin>
{
  "name": "Nombre del Curso",
  "code": "Código del Curso",
  "description": "Descripción del Curso",
  "schedule": "Lunes y Miércoles 10:00-12:00",
  "classroom": "Aula 101",
  "teacherId": 1 // ID del profesor
}



Listar Todos los Cursos
GET /api/courses
Headers: Authorization: Bearer <token_usuario>
Obtener Curso por ID
GET /api/courses/:id
Headers: Authorization: Bearer <token_usuario>


Actualizar Curso
PATCH /api/courses/:id
Headers: Authorization: Bearer <token_admin>
{
  "name": "Nuevo Nombre",
  "description": "Nueva Descripción",
  "schedule": "Nuevo Horario",
  "classroom": "Nueva Aula",
  "teacherId": 2 // Nuevo ID del profesor
}





Eliminar Curso
DELETE /api/courses/:id
Headers: Authorization: Bearer <token_admin>