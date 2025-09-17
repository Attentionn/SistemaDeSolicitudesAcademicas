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
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  return Accommodation;
}; 