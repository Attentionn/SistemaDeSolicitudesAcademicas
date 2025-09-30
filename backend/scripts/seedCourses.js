const { Sequelize } = require('sequelize');
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
});

// Definición del modelo Course
const Course = sequelize.define('Course', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  schedule: {
    type: Sequelize.STRING,
    allowNull: false
  },
  classroom: {
    type: Sequelize.STRING,
    allowNull: false
  },
  teacherId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});

// Datos de cursos de ejemplo
const sampleCourses = [
  {
    name: 'Programación Web',
    code: 'PW-2024-001',
    description: 'Curso de desarrollo web con HTML, CSS, JavaScript y frameworks modernos',
    schedule: 'Lunes y Miércoles 8:00-10:00',
    classroom: 'Laboratorio A-101'
  },
  {
    name: 'Bases de Datos',
    code: 'BD-2024-001',
    description: 'Diseño e implementación de bases de datos relacionales',
    schedule: 'Martes y Jueves 10:00-12:00',
    classroom: 'Aula B-205'
  },
  {
    name: 'Psicología Cognitiva',
    code: 'PC-2024-001',
    description: 'Estudio de los procesos mentales y cognitivos',
    schedule: 'Lunes, Miércoles y Viernes 14:00-16:00',
    classroom: 'Aula C-301'
  },
  {
    name: 'Redes de Computadoras',
    code: 'RC-2024-001',
    description: 'Fundamentos de redes, protocolos y comunicaciones',
    schedule: 'Martes y Jueves 16:00-18:00',
    classroom: 'Laboratorio D-102'
  },
  {
    name: 'Metodología de la Investigación',
    code: 'MI-2024-001',
    description: 'Técnicas y métodos para la investigación científica',
    schedule: 'Viernes 8:00-12:00',
    classroom: 'Aula E-401'
  },
  {
    name: 'Desarrollo de Software',
    code: 'DS-2024-001',
    description: 'Procesos de desarrollo de software y metodologías ágiles',
    schedule: 'Sábado 9:00-13:00',
    classroom: 'Laboratorio F-103'
  }
];

async function seedCourses() {
  console.log('🌱 Iniciando seeding de cursos...\n');
  
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.\n');
    
    // Sincronizar modelos
    await sequelize.sync();
    console.log('✅ Modelos sincronizados con la base de datos.\n');
    
    // Buscar un profesor para asignar los cursos
    const teacher = await User.findOne({ where: { role: 'teacher' } });
    if (!teacher) {
      console.log('❌ No se encontró ningún profesor. Crea un profesor primero.');
      return;
    }
    
    console.log(`👨‍🏫 Asignando cursos al profesor: ${teacher.name}\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const courseData of sampleCourses) {
      try {
        const newCourse = await Course.create({
          ...courseData,
          teacherId: teacher.id
        });
        successCount++;
        console.log(`✅ Curso creado: ${newCourse.name} (${newCourse.code})`);
        console.log(`   📅 Horario: ${newCourse.schedule}`);
        console.log(`   🏫 Aula: ${newCourse.classroom}\n`);
      } catch (error) {
        errorCount++;
        console.log(`❌ Error al crear curso ${courseData.name}: ${error.message}\n`);
      }
    }
    
    console.log('📊 Resumen del seeding:');
    console.log(`   ✅ Cursos creados: ${successCount}`);
    console.log(`   ❌ Errores: ${errorCount}`);
    console.log(`   📝 Total procesados: ${sampleCourses.length}`);
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión a la base de datos cerrada.');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  seedCourses().catch(console.error);
}

module.exports = { seedCourses, sampleCourses };
