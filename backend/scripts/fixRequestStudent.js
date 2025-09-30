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

async function fixRequestStudent() {
  try {
    console.log('🔧 Arreglando la asignación del estudiante en la solicitud...\n');

    // Cambiar el studentId de 1 (Admin) a 3 (Estudiante Prueba)
    const result = await Accommodation.update(
      { studentId: 3 }, // Estudiante Prueba
      { where: { id: 1 } }
    );

    if (result[0] > 0) {
      console.log('✅ Solicitud actualizada correctamente');
      console.log('📝 Cambio: studentId de 1 (Admin) → 3 (Estudiante Prueba)');
    } else {
      console.log('❌ No se pudo actualizar la solicitud');
    }

    // Verificar el cambio
    const updatedRequest = await Accommodation.findByPk(1);
    console.log(`\n📋 Solicitud actualizada:`);
    console.log(`ID: ${updatedRequest.id}`);
    console.log(`Student ID: ${updatedRequest.studentId}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixRequestStudent();
