require('dotenv').config();
const { sequelize, User } = require('./src/models');

async function createAdmin() {
  try {
    await sequelize.sync();
    
    const admin = await User.create({
      name: 'Administrador Principal',
      email: 'admin@ucol.mx',
      password: 'Admin123!',
      role: 'admin'
    });
    
    console.log('✅ Admin creado exitosamente:');
    console.log('Email:', admin.email);
    console.log('Password: Admin123!');
    console.log('\nAhora puedes hacer login en: http://localhost:3000/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();