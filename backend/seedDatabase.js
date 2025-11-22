require('dotenv').config();
const { sequelize, User, Course, Accommodation, Absence, Faculty } = require('./src/models');

async function seedDatabase() {
  try {
    console.log('🔄 Sincronizando base de datos...');
    await sequelize.sync({ force: true });
    
    console.log('✅ Base de datos sincronizada\n');

    // 1. Crear Admin
    console.log('👤 Creando Admin...');
    const admin = await User.create({
      name: 'Administrador Principal',
      email: 'admin@ucol.mx',
      password: 'Admin123!',
      role: 'admin'
    });
    console.log(`✅ Admin creado: ${admin.email}\n`);

    // 2. Crear Facultades
    console.log('🏫 Creando Facultades...');
    const telematica = await Faculty.create({
      name: 'Telemática',
      description: 'Facultad de Telemática'
    });
    const ingenieria = await Faculty.create({
      name: 'Ingeniería',
      description: 'Facultad de Ingeniería'
    });
    const ciencias = await Faculty.create({
      name: 'Ciencias',
      description: 'Facultad de Ciencias'
    });
    console.log('✅ Facultades creadas\n');

    // 3. Crear Profesores
    console.log('👨‍🏫 Creando Profesores...');
    const profesor1 = await User.create({
      name: 'Dr. Carlos Martínez',
      email: 'cmartinez@ucol.mx',
      password: 'Profesor123!',
      role: 'teacher',
      faculty: 'Telemática'
    });

    const profesor2 = await User.create({
      name: 'Dra. Ana López',
      email: 'alopez@ucol.mx',
      password: 'Profesor123!',
      role: 'teacher',
      faculty: 'Telemática'
    });

    const profesor3 = await User.create({
      name: 'Ing. Roberto Sánchez',
      email: 'rsanchez@ucol.mx',
      password: 'Profesor123!',
      role: 'teacher',
      faculty: 'Ingeniería'
    });
    console.log('✅ Profesores creados\n');

    // 4. Crear Estudiantes
    console.log('👨‍🎓 Creando Estudiantes...');
    const estudiantes = [];
    
    for (let i = 1; i <= 10; i++) {
      const estudiante = await User.create({
        name: `Estudiante ${i}`,
        email: `estudiante${i}@ucol.mx`,
        password: 'Estudiante123!',
        role: 'student',
        studentId: `2023${1000 + i}`,
        faculty: i <= 5 ? 'Telemática' : 'Ingeniería'
      });
      estudiantes.push(estudiante);
    }
    console.log(`✅ ${estudiantes.length} Estudiantes creados\n`);

    // 5. Crear Cursos
    console.log('📚 Creando Cursos...');
    const curso1 = await Course.create({
      name: 'Programación Web',
      code: 'TEL101',
      description: 'Desarrollo de aplicaciones web modernas',
      schedule: 'Lunes y Miércoles 10:00-12:00',
      classroom: 'Lab 3',
      teacherId: profesor1.id
    });

    const curso2 = await Course.create({
      name: 'Bases de Datos',
      code: 'TEL102',
      description: 'Diseño y administración de bases de datos',
      schedule: 'Martes y Jueves 14:00-16:00',
      classroom: 'Lab 2',
      teacherId: profesor1.id
    });

    const curso3 = await Course.create({
      name: 'Redes de Computadoras',
      code: 'TEL103',
      description: 'Fundamentos de redes y comunicaciones',
      schedule: 'Viernes 10:00-14:00',
      classroom: 'Lab 1',
      teacherId: profesor2.id
    });

    const curso4 = await Course.create({
      name: 'Algoritmos Avanzados',
      code: 'ING201',
      description: 'Estructuras de datos y algoritmos complejos',
      schedule: 'Lunes y Miércoles 16:00-18:00',
      classroom: 'Aula 5',
      teacherId: profesor3.id
    });

    const curso5 = await Course.create({
      name: 'Inteligencia Artificial',
      code: 'TEL201',
      description: 'Introducción a IA y Machine Learning',
      schedule: 'Jueves 10:00-14:00',
      classroom: 'Lab 4',
      teacherId: profesor2.id
    });
    console.log('✅ Cursos creados\n');

    // 6. Crear Ausencias
    console.log('📝 Creando Ausencias...');
    const fechas = [
      '2024-11-15',
      '2024-11-18',
      '2024-11-20',
      '2024-11-22',
      '2024-11-25'
    ];

    let ausenciasCreadas = 0;
    for (let i = 0; i < 15; i++) {
      const estudianteRandom = estudiantes[Math.floor(Math.random() * estudiantes.length)];
      const cursoRandom = [curso1, curso2, curso3, curso4, curso5][Math.floor(Math.random() * 5)];
      const fechaRandom = fechas[Math.floor(Math.random() * fechas.length)];
      
      await Absence.create({
        studentId: estudianteRandom.id,
        courseId: cursoRandom.id,
        teacherId: cursoRandom.teacherId,
        fecha: fechaRandom,
        materia: cursoRandom.name,
        motivo: ['Enfermedad', 'Asunto Personal', 'Trámite Administrativo'][Math.floor(Math.random() * 3)],
        tipo: ['Justificada', 'Injustificada'][Math.floor(Math.random() * 2)],
        observaciones: 'Ausencia registrada automáticamente'
      });
      ausenciasCreadas++;
    }
    console.log(`✅ ${ausenciasCreadas} Ausencias creadas\n`);

    // 7. Crear Acomodaciones
    console.log('♿ Creando Acomodaciones...');
    const tiposAcomodacion = [
      'Tiempo Extra en Exámenes',
      'Asiento Preferencial',
      'Material en Formato Digital',
      'Intérprete de Lenguaje de Señas',
      'Examen Oral en lugar de Escrito'
    ];

    const statusPosibles = ['pending', 'approved', 'rejected'];
    const fechasAcomodacion = [
      '2024-11-10',
      '2024-11-12',
      '2024-11-15',
      '2024-11-18',
      '2024-11-20'
    ];

    for (let i = 0; i < 20; i++) {
      const estudianteRandom = estudiantes[Math.floor(Math.random() * estudiantes.length)];
      const cursoRandom = [curso1, curso2, curso3, curso4, curso5][Math.floor(Math.random() * 5)];
      const tipoRandom = tiposAcomodacion[Math.floor(Math.random() * tiposAcomodacion.length)];
      const statusRandom = statusPosibles[Math.floor(Math.random() * statusPosibles.length)];
      const fechaRandom = fechasAcomodacion[Math.floor(Math.random() * fechasAcomodacion.length)];
      
      const acomodacion = await Accommodation.create({
        studentId: estudianteRandom.id,
        courseId: cursoRandom.id,
        teacherId: cursoRandom.teacherId,
        requestedDate: fechaRandom,
        type: tipoRandom,
        description: `Solicitud de ${tipoRandom.toLowerCase()} para el curso ${cursoRandom.name}`,
        documentation: 'Documento médico adjunto',
        status: statusRandom
      });

      // Si está aprobada o rechazada, agregar reviewer
      if (statusRandom !== 'pending') {
        await acomodacion.update({
          reviewedBy: cursoRandom.teacherId,
          reviewedAt: new Date(),
          rejectionReason: statusRandom === 'rejected' ? 'No cumple con los requisitos' : null
        });
      }
    }
    console.log('✅ 20 Acomodaciones creadas\n');

    // Resumen
    console.log('═══════════════════════════════════════');
    console.log('🎉 BASE DE DATOS POBLADA EXITOSAMENTE');
    console.log('═══════════════════════════════════════');
    console.log('\n📊 RESUMEN:');
    console.log(`   • 1 Admin`);
    console.log(`   • 3 Facultades`);
    console.log(`   • 3 Profesores`);
    console.log(`   • 10 Estudiantes`);
    console.log(`   • 5 Cursos`);
    console.log(`   • 15 Ausencias`);
    console.log(`   • 20 Acomodaciones`);
    
    console.log('\n🔑 CREDENCIALES DE PRUEBA:');
    console.log('\n   ADMIN:');
    console.log('   Email: admin@ucol.mx');
    console.log('   Pass: Admin123!');
    
    console.log('\n   PROFESOR 1:');
    console.log('   Email: cmartinez@ucol.mx');
    console.log('   Pass: Profesor123!');
    
    console.log('\n   PROFESOR 2:');
    console.log('   Email: alopez@ucol.mx');
    console.log('   Pass: Profesor123!');
    
    console.log('\n   ESTUDIANTE 1:');
    console.log('   Email: estudiante1@ucol.mx');
    console.log('   Pass: Estudiante123!');
    console.log('   Matrícula: 20231001');
    
    console.log('\n   ESTUDIANTE 2:');
    console.log('   Email: estudiante2@ucol.mx');
    console.log('   Pass: Estudiante123!');
    console.log('   Matrícula: 20231002');
    
    console.log('\n═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
}

seedDatabase();