const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
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
  tableName: 'Users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

const minimalUsers = [
  {
    name: 'Administrador',
    email: 'admin@ucol.mx',
    password: 'admin123',
    role: 'admin',
    studentId: null,
    faculty: 'Telemática'
  },
  {
    name: 'Profesor Principal',
    email: 'profesor@ucol.mx',
    password: 'prof123',
    role: 'teacher',
    studentId: null,
    faculty: 'Telemática'
  },
  {
    name: 'Estudiante Prueba',
    email: 'estudiante@ucol.mx',
    password: 'est123',
    role: 'student',
    studentId: '2024001',
    faculty: 'Telemática'
  }
];

async function createMinimalUsers() {
  try {
    console.log('🚀 Creando usuarios mínimos...\n');

    for (const userData of minimalUsers) {
      try {
        const user = await User.create(userData);
        console.log(`✅ Usuario creado: ${user.name} (${user.email}) - Rol: ${user.role}`);
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          console.log(`❌ Error de validación para ${userData.email}:`);
          error.errors.forEach(err => {
            console.log(`   - ${err.message}`);
          });
        } else {
          console.log(`❌ Error creando ${userData.email}: ${error.message}`);
        }
      }
    }

    console.log('\n🎯 Usuarios creados:');
    console.log('📧 admin@ucol.mx / admin123 (Admin)');
    console.log('📧 profesor@ucol.mx / prof123 (Profesor)');
    console.log('📧 estudiante@ucol.mx / est123 (Estudiante)');
    
    console.log('\n✨ ¡Listo! Base de datos limpia con usuarios mínimos.');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    process.exit(0);
  }
}

createMinimalUsers();
