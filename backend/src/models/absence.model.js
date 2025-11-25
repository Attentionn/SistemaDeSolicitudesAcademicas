const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Absence = sequelize.define('Absence', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tipo: {
      type: DataTypes.ENUM('justificada', 'injustificada', 'prevista'),
      defaultValue: 'injustificada'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    evidencia: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Ruta del archivo de evidencia (PDF/PNG)'
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

  return Absence;
};
