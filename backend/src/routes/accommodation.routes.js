const express = require('express');
const { Accommodation, Course, User, Absence } = require('../models');
const { auth, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Create new accommodation request (students only)
router.post('/', auth, checkRole(['student']), async (req, res) => {
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
      studentId: req.user.id,
      courseId,
      teacherId: course.teacher.id
    });

    res.status(201).json(accommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all accommodations for a teacher with filtering
router.get('/teacher', auth, checkRole(['teacher']), async (req, res) => {
  try {
    const { type, status } = req.query;
    const whereClause = { teacherId: req.user.id };
    
    if (type) {
      whereClause.type = type;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const accommodations = await Accommodation.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'student' },
        { model: Course, as: 'course' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(accommodations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all accommodations for a student
router.get('/student', auth, checkRole(['student']), async (req, res) => {
  try {
    const accommodations = await Accommodation.findAll({
      where: { studentId: req.user.id },
      include: [
        { model: User, as: 'teacher' },
        { model: Course, as: 'course' }
      ]
    });
    res.json(accommodations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update accommodation status (teachers only)
router.patch('/:id', auth, checkRole(['teacher']), async (req, res) => {
  try {
    const { status, teacherResponse } = req.body;
    const accommodation = await Accommodation.findByPk(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation request not found' });
    }

    if (accommodation.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this request' });
    }

    await accommodation.update({
      status,
      teacherResponse
    });

    res.json(accommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get accommodation by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id, {
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: Course, as: 'course' }
      ]
    });

    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation request not found' });
    }

    // Check if user has permission to view this accommodation
    if (
      req.user.role !== 'admin' &&
      accommodation.studentId !== req.user.id &&
      accommodation.teacherId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Not authorized to view this request' });
    }

    res.json(accommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 