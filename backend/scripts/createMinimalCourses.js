const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// Definición del modelo User
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM('admin', 'teacher', 'student'),
    allowNull: false
  },
  studentId: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  faculty: {
    type: Sequelize.STRING,
    allowNull: true
  }
}, {
  tableName: 'Users'
});

// Definición del modelo Course
const Course = sequelize.define('Course', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  schedule: {
    type: Sequelize.STRING,
    allowNull: true
  },
  classroom: {
    type: Sequelize.STRING,
    allowNull: true
  },
  teacherId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'Courses'
});

// Definir relaciones
Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });
User.hasMany(Course, { foreignKey: 'teacherId', as: 'courses' });

const minimalCourses = [
  {
    name: 'Introducción a la Programación',
    code: 'PROG101',
    description: 'Curso básico de programación para principiantes',
    schedule: 'Lunes y Miércoles 10:00-12:00',
    classroom: 'Aula 101',
    teacherId: 2 // Profesor Principal
  },
  {
    name: 'Psicología General',
    code: 'PSIC101',
    description: 'Fundamentos de la psicología',
    schedule: 'Martes y Jueves 14:00-16:00',
    classroom: 'Aula 201',
    teacherId: 2 // Profesor Principal
  },
  {
    name: 'Matemáticas Básicas',
    code: 'MATH101',
    description: 'Álgebra y geometría básica',
    schedule: 'Lunes, Miércoles y Viernes 08:00-10:00',
    classroom: 'Aula 301',
    teacherId: 2 // Profesor Principal
  }
];

async function createMinimalCourses() {
  try {
    console.log('🚀 Creando cursos mínimos...\n');

    // Verificar que el profesor existe
    const teacher = await User.findByPk(2);
    if (!teacher) {
      console.log('❌ Error: No se encontró el profesor (ID: 2)');
      return;
    }
    console.log(`✅ Profesor encontrado: ${teacher.name} (${teacher.email})\n`);

    for (const courseData of minimalCourses) {
      try {
        const course = await Course.create(courseData);
        console.log(`✅ Curso creado: ${course.name} (${course.code}) - Profesor: ${teacher.name}`);
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          console.log(`❌ Error de validación para ${courseData.code}:`);
          error.errors.forEach(err => {
            console.log(`   - ${err.message}`);
          });
        } else {
          console.log(`❌ Error creando ${courseData.code}: ${error.message}`);
        }
      }
    }

    console.log('\n📚 Cursos creados:');
    console.log('📖 PROG101 - Introducción a la Programación');
    console.log('📖 PSIC101 - Psicología General');
    console.log('📖 MATH101 - Matemáticas Básicas');
    
    console.log('\n✨ ¡Listo! Cursos creados y asignados al profesor.');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    process.exit(0);
  }
}

createMinimalCourses();
