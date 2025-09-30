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
  studentId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Accommodation'
});

async function fixAllRequestStudents() {
  try {
    console.log('🔧 Arreglando todas las asignaciones incorrectas de estudiantes...\n');

    // Cambiar todas las solicitudes que tengan studentId = 1 (Admin) a studentId = 3 (Estudiante Prueba)
    const result = await Accommodation.update(
      { studentId: 3 }, // Estudiante Prueba
      { where: { studentId: 1 } } // Donde el estudiante sea Admin
    );

    console.log(`✅ Solicitudes actualizadas: ${result[0]}`);
    console.log('📝 Cambio: studentId de 1 (Admin) → 3 (Estudiante Prueba)');

    // Verificar todos los cambios
    const allRequests = await Accommodation.findAll({
      order: [['id', 'ASC']]
    });

    console.log('\n📋 Todas las solicitudes después del cambio:');
    console.log('=====================================');
    
    allRequests.forEach(request => {
      console.log(`ID: ${request.id} - Student ID: ${request.studentId}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixAllRequestStudents();
