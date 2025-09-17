const express = require('express');
const { Absence, Course, User } = require('../models');
const { auth, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all absences for a student
router.get('/student', auth, checkRole(['student']), async (req, res) => {
  try {
    const absences = await Absence.findAll({
      where: { studentId: req.user.id },
      include: [
        { model: Course, as: 'course' },
        { model: User, as: 'teacher' }
      ],
      order: [['fecha', 'DESC']]
    });
    res.json(absences);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create new absence notification (students only)
router.post('/', auth, checkRole(['student']), async (req, res) => {
  try {
    const {
      fecha,
      materia,
      motivo,
      courseId
    } = req.body;

    const course = await Course.findByPk(courseId, {
      include: [{ model: User, as: 'teacher' }]
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const absence = await Absence.create({
      fecha,
      materia,
      motivo,
      tipo: 'prevista',
      studentId: req.user.id,
      courseId,
      teacherId: course.teacher.id
    });

    res.status(201).json(absence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all absences for a teacher (from their students)
router.get('/teacher', auth, checkRole(['teacher']), async (req, res) => {
  try {
    const { studentId } = req.query;
    const whereClause = { teacherId: req.user.id };
    
    if (studentId) {
      whereClause.studentId = studentId;
    }

    const absences = await Absence.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'student' },
        { model: Course, as: 'course' }
      ],
      order: [['fecha', 'DESC']]
    });
    res.json(absences);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update absence (teachers only) - for adding observations or changing type
router.patch('/:id', auth, checkRole(['teacher']), async (req, res) => {
  try {
    const { tipo, observaciones } = req.body;
    const absence = await Absence.findByPk(req.params.id);

    if (!absence) {
      return res.status(404).json({ error: 'Absence not found' });
    }

    if (absence.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this absence' });
    }

    await absence.update({
      tipo,
      observaciones
    });

    res.json(absence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get absence by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const absence = await Absence.findByPk(req.params.id, {
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: Course, as: 'course' }
      ]
    });

    if (!absence) {
      return res.status(404).json({ error: 'Absence not found' });
    }

    // Check if user has permission to view this absence
    if (
      req.user.role !== 'admin' &&
      absence.studentId !== req.user.id &&
      absence.teacherId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Not authorized to view this absence' });
    }

    res.json(absence);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
