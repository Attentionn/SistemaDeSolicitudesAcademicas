const express = require('express');
const { Accommodation, Absence, User, Course } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Admin Dashboard (SOLO ADMINS)
router.get('/admin/dashboard', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const pendingAccommodations = await Accommodation.count({ where: { status: 'pending' } });
    const approvedAccommodations = await Accommodation.count({ where: { status: 'approved' } });
    const rejectedAccommodations = await Accommodation.count({ where: { status: 'rejected' } });
    
    const totalAbsences = await Absence.count();
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalTeachers = await User.count({ where: { role: 'teacher' } });
    const totalCourses = await Course.count();

    res.json({
      accommodations: {
        pending: pendingAccommodations,
        approved: approvedAccommodations,
        rejected: rejectedAccommodations,
        total: pendingAccommodations + approvedAccommodations + rejectedAccommodations
      },
      absences: totalAbsences,
      users: {
        students: totalStudents,
        teachers: totalTeachers,
        total: totalStudents + totalTeachers
      },
      courses: totalCourses
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Teacher Dashboard (SOLO PROFESORES)
router.get('/teacher/dashboard', authenticateToken, authorizeRole('teacher'), async (req, res) => {
  try {
    // Obtener cursos del profesor
    const teacherCourses = await Course.findAll({
      where: { teacherId: req.user.id },
      attributes: ['id']
    });
    const courseIds = teacherCourses.map(c => c.id);

    const pendingAccommodations = await Accommodation.count({ 
      where: { 
        status: 'pending',
        courseId: courseIds 
      } 
    });
    
    const approvedAccommodations = await Accommodation.count({ 
      where: { 
        status: 'approved',
        courseId: courseIds 
      } 
    });
    
    const rejectedAccommodations = await Accommodation.count({ 
      where: { 
        status: 'rejected',
        courseId: courseIds 
      } 
    });

    const totalAbsences = await Absence.count({ 
      where: { courseId: courseIds } 
    });

    res.json({
      accommodations: {
        pending: pendingAccommodations,
        approved: approvedAccommodations,
        rejected: rejectedAccommodations,
        total: pendingAccommodations + approvedAccommodations + rejectedAccommodations
      },
      absences: totalAbsences,
      courses: teacherCourses.length
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Student Dashboard (SOLO ESTUDIANTES)
router.get('/student/dashboard', authenticateToken, authorizeRole('student'), async (req, res) => {
  try {
    const pendingAccommodations = await Accommodation.count({ 
      where: { 
        studentId: req.user.id,
        status: 'pending' 
      } 
    });
    
    const approvedAccommodations = await Accommodation.count({ 
      where: { 
        studentId: req.user.id,
        status: 'approved' 
      } 
    });
    
    const rejectedAccommodations = await Accommodation.count({ 
      where: { 
        studentId: req.user.id,
        status: 'rejected' 
      } 
    });

    const totalAbsences = await Absence.count({ 
      where: { studentId: req.user.id } 
    });

    res.json({
      accommodations: {
        pending: pendingAccommodations,
        approved: approvedAccommodations,
        rejected: rejectedAccommodations,
        total: pendingAccommodations + approvedAccommodations + rejectedAccommodations
      },
      absences: totalAbsences
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all pending requests (ADMIN ve todas, TEACHER ve de sus cursos)
router.get('/pending', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    let whereClause = { status: 'pending' };

    if (req.user.role === 'teacher') {
      const teacherCourses = await Course.findAll({
        where: { teacherId: req.user.id },
        attributes: ['id']
      });
      const courseIds = teacherCourses.map(c => c.id);
      whereClause.courseId = courseIds;
    }

    const pendingRequests = await Accommodation.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(pendingRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Approve request (SOLO PROFESOR del curso o ADMIN)
router.patch('/:id/approve', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!accommodation) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Si es profesor, verificar que sea SU curso
    if (req.user.role === 'teacher' && accommodation.course.teacherId !== req.user.id) {
      return res.status(403).json({ 
        error: 'No puedes aprobar solicitudes de cursos que no enseñas' 
      });
    }

    await accommodation.update({ 
      status: 'approved',
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    });

    const updatedAccommodation = await Accommodation.findByPk(accommodation.id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.json(updatedAccommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reject request (SOLO PROFESOR del curso o ADMIN)
router.patch('/:id/reject', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const { reason } = req.body;

    const accommodation = await Accommodation.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!accommodation) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Si es profesor, verificar que sea SU curso
    if (req.user.role === 'teacher' && accommodation.course.teacherId !== req.user.id) {
      return res.status(403).json({ 
        error: 'No puedes rechazar solicitudes de cursos que no enseñas' 
      });
    }

    await accommodation.update({ 
      status: 'rejected',
      rejectionReason: reason,
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    });

    const updatedAccommodation = await Accommodation.findByPk(accommodation.id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.json(updatedAccommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
