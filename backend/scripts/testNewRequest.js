const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// Definición del modelo Accommodation
const Accommodation = sequelize.define('Accommodation', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  motivo: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  studentId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  courseId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  teacherId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Accommodation'
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
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM('admin', 'teacher', 'student'),
    allowNull: false
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
  }
}, {
  tableName: 'Courses'
});

// Definir relaciones
Accommodation.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Accommodation.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });
Accommodation.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

async function testNewRequest() {
  try {
    console.log('🧪 Probando creación de nueva solicitud...\n');

    // Simular la creación de una nueva solicitud (como lo haría el endpoint)
    const newAccommodation = await Accommodation.create({
      type: 'exam_date_change',
      status: 'pending',
      description: 'Prueba de descripción',
      motivo: 'Prueba de motivo',
      studentId: 3, // Estudiante correcto
      courseId: 1, // Curso de programación
      teacherId: 2 // Profesor
    });

    console.log('✅ Nueva solicitud creada:');
    console.log(`ID: ${newAccommodation.id}`);
    console.log(`Student ID: ${newAccommodation.studentId}`);
    console.log(`Motivo: ${newAccommodation.motivo}`);
    console.log(`Descripción: ${newAccommodation.description}`);

    // Verificar que se asignó correctamente
    const accommodationWithRelations = await Accommodation.findByPk(newAccommodation.id, {
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: Course, as: 'course' }
      ]
    });

    console.log('\n📋 Verificación de relaciones:');
    console.log(`Estudiante: ${accommodationWithRelations.student ? accommodationWithRelations.student.name : 'N/A'}`);
    console.log(`Profesor: ${accommodationWithRelations.teacher ? accommodationWithRelations.teacher.name : 'N/A'}`);
    console.log(`Curso: ${accommodationWithRelations.course ? accommodationWithRelations.course.name : 'N/A'}`);

    if (accommodationWithRelations.student && accommodationWithRelations.student.id === 3) {
      console.log('\n✅ ¡PERFECTO! La solicitud se asignó al estudiante correcto.');
    } else {
      console.log('\n❌ ERROR: La solicitud no se asignó al estudiante correcto.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testNewRequest();
