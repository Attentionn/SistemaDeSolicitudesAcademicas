require('dotenv').config();
const { sequelize, User, Faculty } = require('./src/models');

async function seedDatabase() {
  try {
    console.log('🔄 Sincronizando base de datos...');
    await sequelize.sync({ force: true });
    
    console.log('✅ Base de datos sincronizada\n');

    // ============================================
    // CREAR FACULTADES
    // ============================================
    console.log('🏫 Creando Facultad...');
    const faculties = await Faculty.bulkCreate([
      { name: 'Telemática', description: 'Facultad de Ingeniería en Telemática' }
    ]);
    console.log(`✅ ${faculties.length} Facultad creada\n`);

    // ============================================
    // CREAR ADMIN
    // ============================================
    console.log('👤 Creando Admin...');
    const admin = await User.create({
      name: 'Administrador Principal',
      email: 'admin@ucol.mx',
      password: 'Admin123!',
      role: 'admin',
      faculty: 'Telemática'
    });
    console.log(`✅ Admin creado: ${admin.email}\n`);

    console.log('═══════════════════════════════════════');
    console.log('🎉 BASE DE DATOS POBLADA EXITOSAMENTE');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 RESUMEN:');
    console.log(`   • 1 Facultad (Telemática)`);
    console.log(`   • 1 Admin`);
    
    console.log('\n🔑 CREDENCIALES:');
    console.log('   Email: admin@ucol.mx');
    console.log('   Pass: Admin123!');
    console.log('\n═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

seedDatabase();