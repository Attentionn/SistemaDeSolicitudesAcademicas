const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
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
    allowNull: false
  }
}, {
  tableName: 'Courses'
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
  role: {
    type: Sequelize.ENUM('admin', 'teacher', 'student'),
    allowNull: false
  }
}, {
  tableName: 'Users'
});

// Definir relaciones
Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

async function checkCourses() {
  try {
    console.log('📚 Verificando cursos en la base de datos...\n');

    const courses = await Course.findAll({
      include: [{ model: User, as: 'teacher' }]
    });

    if (courses.length === 0) {
      console.log('❌ No se encontraron cursos en la base de datos.');
      return;
    }

    console.log('📚 Cursos en la base de datos:');
    console.log('=====================================');
    
    courses.forEach(course => {
      console.log(`ID: ${course.id}`);
      console.log(`Nombre: ${course.name}`);
      console.log(`Código: ${course.code}`);
      console.log(`Descripción: ${course.description || 'N/A'}`);
      console.log(`Horario: ${course.schedule || 'N/A'}`);
      console.log(`Aula: ${course.classroom || 'N/A'}`);
      console.log(`Profesor: ${course.teacher ? course.teacher.name : 'N/A'}`);
      console.log('-------------------------------------');
    });

    console.log(`\n✅ Total de cursos: ${courses.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkCourses();
