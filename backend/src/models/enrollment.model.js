const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Enrollment = sequelize.define('Enrollment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    enrollmentDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('active', 'dropped', 'completed'),
      defaultValue: 'active'
    }
  }, {
    tableName: 'enrollments',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'courseId']
      }
    ]
  });

  // Validaciones de integridad de Enrollment
  Enrollment.addHook('beforeCreate', async (enrollment) => {
    const { User, Course } = sequelize.models;
    const student = await User.findByPk(enrollment.studentId);
    if (!student) throw new Error('studentId no existe');
    if (student.role !== 'student') throw new Error('studentId debe pertenecer a un usuario con rol student');
    const course = await Course.findByPk(enrollment.courseId);
    if (!course) throw new Error('courseId no existe');
  });

  return Enrollment;
};