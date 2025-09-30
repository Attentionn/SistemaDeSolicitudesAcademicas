const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// Definición del modelo User (igual al del servidor principal)
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

async function debugUsers() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.\n');
    
    await sequelize.sync();
    console.log('✅ Modelos sincronizados con la base de datos.\n');
    
    // Ver todos los usuarios
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'studentId', 'faculty', 'createdAt']
    });
    
    console.log('📋 Usuarios en la base de datos:');
    console.log('=====================================');
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
    } else {
      users.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Nombre: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Rol: ${user.role}`);
        console.log(`Matrícula: ${user.studentId || 'N/A'}`);
        console.log(`Facultad: ${user.faculty || 'N/A'}`);
        console.log(`Creado: ${user.createdAt}`);
        console.log('-------------------------------------');
      });
    }
    
    // Probar login con usuarios existentes
    console.log('\n🔍 Probando login con usuarios existentes...');
    
    const testUsers = [
        { email: 'admin@ucol.mx', password: 'admin123' },
        { email: 'juan.perez@ucol.mx', password: 'profesor123' },
        { email: 'maria.garcia@ucol.mx', password: 'estudiante123' },
        { email: 'web.test@ucol.mx', password: 'web123456' }
    ];
    
    for (const testUser of testUsers) {
        const user = await User.findOne({ where: { email: testUser.email } });
        if (user) {
            const isValid = await bcrypt.compare(testUser.password, user.password);
            console.log(`${testUser.email}: ${isValid ? '✅ FUNCIONA' : '❌ FALLA'}`);
        } else {
            console.log(`${testUser.email}: ❌ NO ENCONTRADO`);
        }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Función para crear un usuario de prueba correctamente
async function createTestUser() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    
    const userData = {
      name: 'Usuario Prueba',
      email: 'prueba@ucol.mx',
      password: 'test123',
      role: 'student',
      studentId: '2024999',
      faculty: 'Telemática'
    };
    
    console.log('🧪 Creando usuario de prueba...');
    const newUser = await User.create(userData);
    console.log('✅ Usuario creado:', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      studentId: newUser.studentId,
      faculty: newUser.faculty
    });
    
    // Probar login inmediatamente
    const loginUser = await User.findOne({ where: { email: 'prueba@ucol.mx' } });
    const isValid = await bcrypt.compare('test123', loginUser.password);
    console.log(`🔑 Login test: ${isValid ? '✅ FUNCIONA' : '❌ FALLA'}`);
    
  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar según el argumento
const command = process.argv[2];

if (command === 'create') {
  createTestUser();
} else {
  debugUsers();
}
