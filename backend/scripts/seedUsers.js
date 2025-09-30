const { addUserWithData } = require('./addUser');

// Datos de usuarios de ejemplo para seeding
const sampleUsers = [
  {
    name: 'Admin Principal',
    email: 'admin@ucol.mx',
    password: 'admin123',
    role: 'admin',
    faculty: 'Psicología'
  },
  {
    name: 'Profesor Juan Pérez',
    email: 'juan.perez@ucol.mx',
    password: 'profesor123',
    role: 'teacher',
    faculty: 'Telemática'
  },
  {
    name: 'María García',
    email: 'maria.garcia@ucol.mx',
    password: 'estudiante123',
    role: 'student',
    studentId: '2024001',
    faculty: 'Psicología'
  },
  {
    name: 'Carlos López',
    email: 'carlos.lopez@ucol.mx',
    password: 'estudiante123',
    role: 'student',
    studentId: '2024002',
    faculty: 'Telemática'
  },
  {
    name: 'Ana Martínez',
    email: 'ana.martinez@ucol.mx',
    password: 'estudiante123',
    role: 'student',
    studentId: '2024003',
    faculty: 'Ciencias de la Educación'
  }
];

async function seedUsers() {
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
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM('student', 'teacher', 'admin'),
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
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  console.log('🌱 Iniciando seeding de usuarios...\n');
  
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.\n');
    
    // Sincronizar modelos
    await sequelize.sync();
    console.log('✅ Modelos sincronizados con la base de datos.\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const userData of sampleUsers) {
      try {
        const newUser = await User.create(userData);
        successCount++;
        console.log(`✅ Usuario ${userData.name} creado exitosamente`);
        console.log(`   Email: ${newUser.email}`);
        console.log(`   Rol: ${newUser.role}\n`);
      } catch (error) {
        errorCount++;
        console.log(`❌ Error al crear usuario ${userData.name}: ${error.message}\n`);
      }
    }
    
    console.log('📊 Resumen del seeding:');
    console.log(`   ✅ Usuarios creados: ${successCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📝 Total procesados: ${sampleUsers.length}`);
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada.');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedUsers().catch(console.error);
}

module.exports = { seedUsers, sampleUsers };
