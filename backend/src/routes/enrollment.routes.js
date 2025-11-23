const express = require('express');
const { Enrollment, Course, User } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Enroll student in course (ADMIN o TEACHER)
router.post('/', authenticateToken, authorizeRole('admin', 'teacher'), async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const student = await User.findByPk(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: 'Student not found' });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: { studentId, courseId }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Student already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({ studentId, courseId });

    res.status(201).json({
      id: enrollment.id,
      studentId: enrollment.studentId,
      courseId: enrollment.courseId,
      enrollmentDate: enrollment.enrollmentDate,
      status: enrollment.status
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get student's enrolled courses
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;

    // ✅ ADMIN puede ver cualquier estudiante
    // ✅ ESTUDIANTE solo puede ver sus propios cursos
    if (req.user.role === 'student' && req.user.id !== parseInt(studentId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const enrollments = await Enrollment.findAll({
      where: { studentId, status: 'active' },
      include: [{
        model: Course,
        as: 'course',
        include: [{
          model: User,
          as: 'teacher',
          attributes: ['id', 'name', 'email']
        }]
      }]
    });

    res.json(enrollments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get course's enrolled students
router.get('/course/:courseId', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollments = await Enrollment.findAll({
      where: { courseId, status: 'active' },
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'name', 'email', 'studentId', 'faculty']
      }]
    });

    res.json(enrollments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Drop enrollment
router.delete('/:id', authenticateToken, authorizeRole('admin', 'teacher'), async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    await enrollment.update({ status: 'dropped' });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;