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

async function testAdminEndpoint() {
  try {
    console.log('🔍 Simulando endpoint /api/requests/admin...\n');

    // Simular la lógica del endpoint
    const accommodations = await Accommodation.findAll({
      where: {},
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: Course, as: 'course' }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform data to unified format (como en requests.routes.js)
    const allRequests = accommodations.map(accommodation => ({
      id: accommodation.id,
      type: 'accommodation',
      student: accommodation.student,
      teacher: accommodation.teacher,
      course: accommodation.course,
      status: accommodation.status || 'pending',
      motivo: accommodation.motivo,
      description: accommodation.description,
      createdAt: accommodation.createdAt,
      updatedAt: accommodation.updatedAt,
      teacherComment: accommodation.teacherResponse,
      // Accommodation specific fields
      requestedDate: accommodation.requestedDate,
      newDate: accommodation.newDate,
      newClassroom: accommodation.newClassroom,
      extensionDays: accommodation.extensionDays,
      fechaOriginal: accommodation.fechaOriginal,
      fechaPropuesta: accommodation.fechaPropuesta
    }));

    console.log('📋 Datos que devuelve el endpoint:');
    console.log('=====================================');
    console.log(JSON.stringify(allRequests, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

testAdminEndpoint();
