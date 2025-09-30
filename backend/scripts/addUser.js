const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');
const readline = require('readline');

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// Definición del modelo User (copiado del modelo principal)
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

// Función para crear interfaz de línea de comandos
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Función para hacer preguntas al usuario
function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Función para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Función para validar rol
function isValidRole(role) {
  return ['student', 'teacher', 'admin'].includes(role.toLowerCase());
}

// Función principal para añadir usuario
async function addUser() {
  const rl = createInterface();
  
  try {
    console.log('\n=== SCRIPT PARA AÑADIR USUARIOS ===\n');
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.\n');
    
    // Sincronizar modelos
    await sequelize.sync();
    console.log('✅ Modelos sincronizados con la base de datos.\n');
    
    // Recopilar información del usuario
    const name = await askQuestion(rl, 'Nombre completo: ');
    if (!name) {
      throw new Error('El nombre es obligatorio');
    }
    
    const email = await askQuestion(rl, 'Email: ');
    if (!email || !isValidEmail(email)) {
      throw new Error('Email inválido o vacío');
    }
    
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Ya existe un usuario con este email');
    }
    
    const password = await askQuestion(rl, 'Contraseña: ');
    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    
    const role = await askQuestion(rl, 'Rol (student/teacher/admin): ');
    if (!role || !isValidRole(role)) {
      throw new Error('Rol inválido. Debe ser: student, teacher o admin');
    }
    
    const studentId = await askQuestion(rl, 'ID de estudiante (opcional, presiona Enter para omitir): ');
    
    const faculty = await askQuestion(rl, 'Facultad (opcional, presiona Enter para omitir): ');
    
    // Crear el usuario
    const userData = {
      name,
      email,
      password,
      role: role.toLowerCase(),
      studentId: studentId || null,
      faculty: faculty || null
    };
    
    const newUser = await User.create(userData);
    
    console.log('\n✅ Usuario creado exitosamente!');
    console.log('📋 Detalles del usuario:');
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Nombre: ${newUser.name}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Rol: ${newUser.role}`);
    console.log(`   ID Estudiante: ${newUser.studentId || 'N/A'}`);
    console.log(`   Facultad: ${newUser.faculty || 'N/A'}`);
    
    // Preguntar si quiere añadir otro usuario
    const addAnother = await askQuestion(rl, '\n¿Deseas añadir otro usuario? (s/n): ');
    if (addAnother.toLowerCase() === 's' || addAnother.toLowerCase() === 'si') {
      rl.close();
      await addUser(); // Llamada recursiva
    } else {
      console.log('\n👋 ¡Hasta luego!');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    // Preguntar si quiere intentar de nuevo
    const tryAgain = await askQuestion(rl, '\n¿Deseas intentar de nuevo? (s/n): ');
    if (tryAgain.toLowerCase() === 's' || tryAgain.toLowerCase() === 'si') {
      rl.close();
      await addUser(); // Llamada recursiva
    } else {
      console.log('\n👋 ¡Hasta luego!');
    }
  } finally {
    rl.close();
    await sequelize.close();
  }
}

// Función para añadir usuario con datos predefinidos (para testing)
async function addUserWithData(userData) {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    
    const newUser = await User.create(userData);
    console.log('✅ Usuario creado:', newUser.toJSON());
    
    return newUser;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Ejecutar el script
if (require.main === module) {
  addUser().catch(console.error);
}

module.exports = { addUser, addUserWithData };
