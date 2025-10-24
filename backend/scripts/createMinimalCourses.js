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
    name: 'Programación Web',
    code: 'TELM301',
    description: 'Desarrollo de aplicaciones web con HTML, CSS y JavaScript',
    schedule: 'Lunes y Miércoles 10:00-12:00',
    classroom: 'Laboratorio A-101',
    teacherId: 2 // Profesor Principal
  },
  {
    name: 'Redes de Computadoras',
    code: 'TELM302',
    description: 'Fundamentos de redes y protocolos de comunicación',
    schedule: 'Martes y Jueves 14:00-16:00',
    classroom: 'Laboratorio A-201',
    teacherId: 2 // Profesor Principal
  },
  {
    name: 'Base de Datos',
    code: 'TELM303',
    description: 'Diseño y administración de bases de datos',
    schedule: 'Lunes, Miércoles y Viernes 08:00-10:00',
    classroom: 'Laboratorio A-301',
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
    console.log('📖 TELM301 - Programación Web');
    console.log('📖 TELM302 - Redes de Computadoras');
    console.log('📖 TELM303 - Base de Datos');
    
    console.log('\n✨ ¡Listo! Cursos creados y asignados al profesor.');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    process.exit(0);
  }
}

createMinimalCourses();
