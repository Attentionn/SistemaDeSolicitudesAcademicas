const express = require('express');
const { Accommodation, Course, User } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Create new accommodation request (SOLO ESTUDIANTES)
router.post('/', authenticateToken, authorizeRole('student'), async (req, res) => {
  try {
    const {
      type,
      description,
      requestedDate,
      newDate,
      newClassroom,
      extensionDays,
      courseId,
      motivo,
      fechaOriginal,
      fechaPropuesta
    } = req.body;

    const course = await Course.findByPk(courseId, {
      include: [{ model: User, as: 'teacher' }]
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const accommodation = await Accommodation.create({
      type,
      description,
      requestedDate,
      newDate,
      newClassroom,
      extensionDays,
      motivo,
      fechaOriginal,
      fechaPropuesta,
      studentId: req.user.id, // ID del estudiante autenticado
      courseId,
      teacherId: course.teacher.id
    });

    const accommodationWithDetails = await Accommodation.findByPk(accommodation.id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.status(201).json(accommodationWithDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all accommodations for a teacher (SOLO PROFESORES/ADMIN)
router.get('/teacher', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const { type, status } = req.query;
    const whereClause = {};
    
    // Profesor solo ve solicitudes de SUS cursos
    if (req.user.role === 'teacher') {
      whereClause.teacherId = req.user.id;
    }
    // Admin ve todas (whereClause vacío)
    
    if (type) {
      whereClause.type = type;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const accommodations = await Accommodation.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(accommodations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all accommodations for a student (SOLO ESTUDIANTES)
router.get('/student', authenticateToken, authorizeRole('student'), async (req, res) => {
  try {
    const accommodations = await Accommodation.findAll({
      where: {
        studentId: req.user.id // Solo sus propias solicitudes
      },
      include: [
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(accommodations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update accommodation status (SOLO PROFESORES que enseñan el curso o ADMIN)
router.patch('/:id', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const { status, teacherResponse } = req.body;
    const accommodation = await Accommodation.findByPk(req.params.id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation request not found' });
    }

    // Verificar que el profesor enseña ese curso
    if (req.user.role === 'teacher' && accommodation.teacherId !== req.user.id) {
      return res.status(403).json({ 
        error: 'No puedes modificar solicitudes de cursos que no enseñas' 
      });
    }

    await accommodation.update({
      status,
      teacherResponse,
      reviewedBy: req.user.id,
      reviewedAt: new Date()
    });

    const updatedAccommodation = await Accommodation.findByPk(accommodation.id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.json(updatedAccommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get accommodation by ID (AUTENTICADO)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ]
    });

    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation request not found' });
    }

    // Verificar permisos
    const isStudent = req.user.role === 'student' && accommodation.studentId === req.user.id;
    const isTeacher = req.user.role === 'teacher' && accommodation.teacherId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isStudent && !isTeacher && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to view this request' });
    }

    res.json(accommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete accommodation request (ESTUDIANTE dueño, PROFESOR del curso, o ADMIN)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation request not found' });
    }

    // Verificar permisos
    const isOwner = req.user.role === 'student' && accommodation.studentId === req.user.id;
    const isTeacher = req.user.role === 'teacher' && accommodation.teacherId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isTeacher && !isAdmin) {
      return res.status(403).json({ 
        error: 'No tienes permiso para eliminar esta solicitud' 
      });
    }

    await accommodation.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;