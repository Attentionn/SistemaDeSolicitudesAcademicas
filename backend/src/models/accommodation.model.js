const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Accommodation = sequelize.define('Accommodation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM(
        'exam_date_change',
        'classroom_change',
        'notes_request',
        'assignment_extension',
        'deadline_extension',
        'exam_change',
        'absence_notification'
      ),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    requestedDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    newDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaOriginal: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaPropuesta: {
      type: DataTypes.DATE,
      allowNull: true
    },
    newClassroom: {
      type: DataTypes.STRING,
      allowNull: true
    },
    extensionDays: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    teacherResponse: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Courses',
        key: 'id'
      }
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  // Validaciones complejas antes de crear Accommodation
  Accommodation.addHook('beforeCreate', async (acc) => {
    const { User, Course, Enrollment } = sequelize.models;
    const student = await User.findByPk(acc.studentId);
    if (!student) throw new Error('studentId no existe');
    if (student.role !== 'student') throw new Error('studentId debe pertenecer a rol student');

    const course = await Course.findByPk(acc.courseId);
    if (!course) throw new Error('courseId no existe');

    // Verificar que el estudiante esté inscrito en el curso
    const enrolled = await Enrollment.findOne({ where: { studentId: acc.studentId, courseId: acc.courseId } });
    if (!enrolled) throw new Error('El estudiante no está inscrito en el curso indicado');

    // Si hay teacherId validar rol y consistencia con el curso
    if (acc.teacherId) {
      const teacher = await User.findByPk(acc.teacherId);
      if (!teacher) throw new Error('teacherId no existe');
      if (teacher.role !== 'teacher') throw new Error('teacherId debe pertenecer a rol teacher');
      if (course.teacherId !== acc.teacherId) throw new Error('teacherId no coincide con el profesor asignado al curso');
    }

    // Validaciones según tipo (flexibilizando campos para coincidir con frontend)
    switch (acc.type) {
      case 'exam_date_change':
      case 'exam_change': {
        // Aceptar newDate o fechaPropuesta. Si solo viene fechaPropuesta, usarla como newDate.
        if (!acc.newDate && !acc.fechaPropuesta) {
          throw new Error('Se requiere newDate o fechaPropuesta para cambios de examen');
        }
        if (!acc.newDate && acc.fechaPropuesta) {
          acc.newDate = acc.fechaPropuesta; // normalizar
        }
        break;
      }
      case 'classroom_change': {
        if (!acc.newClassroom) throw new Error('newClassroom requerido para cambio de aula');
        break;
      }
      case 'assignment_extension':
      case 'deadline_extension': {
        // Permitir extensionDays explícito o derivarlo de diferencia de fechas si vienen fechaOriginal y fechaPropuesta
        if ((!acc.extensionDays || acc.extensionDays < 1)) {
          if (acc.fechaOriginal && acc.fechaPropuesta) {
            const original = new Date(acc.fechaOriginal);
            const proposed = new Date(acc.fechaPropuesta);
            const diffMs = proposed - original;
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays < 1) throw new Error('La fecha propuesta debe ser posterior a la original para calcular extensión');
            acc.extensionDays = diffDays;
          } else {
            throw new Error('extensionDays >= 1 o (fechaOriginal y fechaPropuesta) requeridos para extensión');
          }
        }
        break;
      }
      default:
        break;
    }
  });

  return Accommodation;
}; 