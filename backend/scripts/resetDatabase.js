const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de la base de datos
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

async function resetDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.\n');
    
    // Eliminar todas las tablas
    await sequelize.drop();
    console.log('🗑️  Base de datos eliminada completamente.\n');
    
    // Sincronizar modelos (crear tablas nuevas)
    await sequelize.sync();
    console.log('✅ Base de datos recreada con tablas vacías.\n');
    
    console.log('🎉 Base de datos reseteada exitosamente!');
    console.log('Ahora puedes crear usuarios nuevos sin problemas.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

resetDatabase();
