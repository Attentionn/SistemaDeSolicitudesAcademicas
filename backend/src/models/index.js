const sequelize = require('../config/database');
const User = require('./user.model')(sequelize);
const Course = require('./course.model')(sequelize);
const Accommodation = require('./accommodation.model')(sequelize);
const Absence = require('./absence.model')(sequelize);

// Define relationships
User.hasMany(Course, { foreignKey: 'teacherId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

User.hasMany(Accommodation, { foreignKey: 'studentId', as: 'studentAccommodations' });
User.hasMany(Accommodation, { foreignKey: 'teacherId', as: 'teacherAccommodations' });
Accommodation.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Accommodation.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

Course.hasMany(Accommodation, { foreignKey: 'courseId', as: 'accommodations' });
Accommodation.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Absence relationships
User.hasMany(Absence, { foreignKey: 'studentId', as: 'studentAbsences' });
User.hasMany(Absence, { foreignKey: 'teacherId', as: 'teacherAbsences' });
Absence.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Absence.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

Course.hasMany(Absence, { foreignKey: 'courseId', as: 'absences' });
Absence.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

module.exports = {
  sequelize,
  User,
  Course,
  Accommodation,
  Absence
}; 