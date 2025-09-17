const { sequelize, User, Course } = require('./src/models');

async function createCourses() {
  try {
    // Primero, necesitamos un profesor para asignar los cursos
    // Vamos a buscar si ya existe un profesor o crear uno
    let teacher = await User.findOne({ where: { role: 'teacher' } });
    
    if (!teacher) {
      console.log('No se encontró ningún profesor. Creando uno de ejemplo...');
      teacher = await User.create({
        name: 'Profesor Ejemplo',
        email: 'profesor@ejemplo.com',
        password: 'password123',
        role: 'teacher',
        faculty: 'Ingeniería'
      });
      console.log('Profesor creado:', teacher.name);
    }

    // Crear los cursos
    const courses = [
      {
        name: 'Programación Orientada a Objetos',
        code: 'POO-2024',
        description: 'Curso de programación orientada a objetos con Java y C++',
        schedule: 'Lunes y Miércoles 10:00-12:00',
        classroom: 'Aula 101',
        teacherId: teacher.id
      },
      {
        name: 'Redes Sociales',
        code: 'RS-2024',
        description: 'Análisis y gestión de redes sociales para empresas',
        schedule: 'Martes y Jueves 14:00-16:00',
        classroom: 'Aula 205',
        teacherId: teacher.id
      },
      {
        name: 'Proyecto de Innovación',
        code: 'PI-2024',
        description: 'Desarrollo de proyectos innovadores y emprendimiento',
        schedule: 'Viernes 09:00-13:00',
        classroom: 'Laboratorio 301',
        teacherId: teacher.id
      }
    ];

    for (const courseData of courses) {
      const existingCourse = await Course.findOne({ where: { code: courseData.code } });
      
      if (!existingCourse) {
        const course = await Course.create(courseData);
        console.log(`✅ Curso creado: ${course.name} (${course.code})`);
      } else {
        console.log(`⚠️  Curso ya existe: ${courseData.name} (${courseData.code})`);
      }
    }

    console.log('\n🎉 ¡Cursos creados exitosamente!');
    console.log('Ahora puedes:');
    console.log('1. Iniciar sesión como estudiante');
    console.log('2. Ir a Solicitudes > Nueva Solicitud');
    console.log('3. Seleccionar uno de los cursos creados');

  } catch (error) {
    console.error('Error creando cursos:', error);
  } finally {
    await sequelize.close();
  }
}

createCourses();
