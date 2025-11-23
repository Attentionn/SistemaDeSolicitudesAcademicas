const sequelize = require('../config/database');
const User = require('./user.model')(sequelize);
const Course = require('./course.model')(sequelize);
const Accommodation = require('./accommodation.model')(sequelize);
const Absence = require('./absence.model')(sequelize);
const Faculty = require('./faculty.model')(sequelize);
const Enrollment = require('./enrollment.model')(sequelize);

// Define relationships

// User - Course (Teacher)
User.hasMany(Course, { foreignKey: 'teacherId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

// User - Course (Students) - Muchos a Muchos
User.belongsToMany(Course, { 
  through: Enrollment, 
  foreignKey: 'studentId', 
  as: 'enrolledCourses' 
});
Course.belongsToMany(User, { 
  through: Enrollment, 
  foreignKey: 'courseId', 
  as: 'students' 
});

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
User.hasMany(Absence, { foreignKey: 'teacherId', as: 'recordedAbsences' });
Absence.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

// Course - Absence
Course.hasMany(Absence, { foreignKey: 'courseId', as: 'absences' });
Absence.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

module.exports = {
  sequelize,
  User,
  Course,
  Accommodation,
  Absence,
  Faculty,
  Enrollment
};