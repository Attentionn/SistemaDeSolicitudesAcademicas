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
  status: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  tableName: 'Accommodation'
});

async function resetRequestStatus() {
  try {
    console.log('🔄 Reseteando estado de la solicitud a "pending"...\n');

    // Cambiar el estado de "rejected" a "pending"
    const result = await Accommodation.update(
      { status: 'pending' },
      { where: { id: 1 } }
    );

    if (result[0] > 0) {
      console.log('✅ Estado actualizado correctamente');
      console.log('📝 Cambio: status de "rejected" → "pending"');
    } else {
      console.log('❌ No se pudo actualizar el estado');
    }

    // Verificar el cambio
    const updatedRequest = await Accommodation.findByPk(1);
    console.log(`\n📋 Solicitud actualizada:`);
    console.log(`ID: ${updatedRequest.id}`);
    console.log(`Status: ${updatedRequest.status}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

resetRequestStatus();
