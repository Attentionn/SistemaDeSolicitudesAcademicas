const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    schedule: {
      type: DataTypes.STRING,
      allowNull: false
    },
    classroom: {
      type: DataTypes.STRING,
      allowNull: false
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

  // Validar que el teacherId corresponde a un usuario con rol 'teacher'
  Course.addHook('beforeCreate', async (course) => {
    const { User } = sequelize.models;
    if (!course.teacherId) throw new Error('Course requiere teacherId');
    const teacher = await User.findByPk(course.teacherId);
    if (!teacher) throw new Error('Profesor asignado no existe');
    if (teacher.role !== 'teacher') throw new Error('teacherId debe pertenecer a un usuario con rol teacher');
  });

  Course.addHook('beforeUpdate', async (course) => {
    if (course.changed('teacherId')) {
      const { User } = sequelize.models;
      const teacher = await User.findByPk(course.teacherId);
      if (!teacher) throw new Error('Profesor asignado no existe');
      if (teacher.role !== 'teacher') throw new Error('teacherId debe pertenecer a un usuario con rol teacher');
    }
  });

  return Course;
}; 