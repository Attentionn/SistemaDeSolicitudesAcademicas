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
  requestedDate: {
    type: Sequelize.DATE,
    allowNull: true
  },
  fechaOriginal: {
    type: Sequelize.DATE,
    allowNull: true
  },
  fechaPropuesta: {
    type: Sequelize.DATE,
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
  },
  code: {
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

async function checkRequest() {
  try {
    console.log('🔍 Verificando solicitudes en la base de datos...\n');

    const accommodations = await Accommodation.findAll({
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: Course, as: 'course' }
      ]
    });

    if (accommodations.length === 0) {
      console.log('❌ No se encontraron solicitudes en la base de datos.');
      return;
    }

    console.log('📋 Solicitudes encontradas:');
    console.log('=====================================');
    
    accommodations.forEach(accommodation => {
      console.log(`ID: ${accommodation.id}`);
      console.log(`Tipo: ${accommodation.type}`);
      console.log(`Estado: ${accommodation.status}`);
      console.log(`Motivo: ${accommodation.motivo || 'N/A'}`);
      console.log(`Descripción: ${accommodation.description || 'N/A'}`);
      console.log(`Fecha Original: ${accommodation.fechaOriginal || 'N/A'}`);
      console.log(`Fecha Propuesta: ${accommodation.fechaPropuesta || 'N/A'}`);
      console.log(`Estudiante: ${accommodation.student ? accommodation.student.name : 'N/A'}`);
      console.log(`Profesor: ${accommodation.teacher ? accommodation.teacher.name : 'N/A'}`);
      console.log(`Curso: ${accommodation.course ? accommodation.course.name : 'N/A'}`);
      console.log('-------------------------------------');
    });

    console.log(`\n✅ Total de solicitudes: ${accommodations.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkRequest();
