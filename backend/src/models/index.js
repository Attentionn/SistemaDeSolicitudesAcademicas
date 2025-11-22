const sequelize = require('../config/database');
const User = require('./user.model')(sequelize);
const Course = require('./course.model')(sequelize);
const Accommodation = require('./accommodation.model')(sequelize);
const Absence = require('./absence.model')(sequelize);
const Faculty = require('./faculty.model')(sequelize);

// Define relationships

// User - Course (Teacher)
User.hasMany(Course, { foreignKey: 'teacherId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

// User - Accommodation (Student)
User.hasMany(Accommodation, { foreignKey: 'studentId', as: 'studentAccommodations' });
Accommodation.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Course - Accommodation
Course.hasMany(Accommodation, { foreignKey: 'courseId', as: 'accommodations' });
Accommodation.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User - Absence (Student)
User.hasMany(Absence, { foreignKey: 'studentId', as: 'absences' });
Absence.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// User - Absence (Teacher)
User.hasMany(Absence, { foreignKey: 'teacherId', as: 'teacherAbsences' });
Absence.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

// Course - Absence
Course.hasMany(Absence, { foreignKey: 'courseId', as: 'courseAbsences' });
Absence.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

module.exports = {
  sequelize,
  User,
  Course,
  Accommodation,
  Absence,
  Faculty
};