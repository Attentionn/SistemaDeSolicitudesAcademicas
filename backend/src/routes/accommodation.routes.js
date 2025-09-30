const express = require('express');
const { Accommodation, Course, User, Absence } = require('../models');
// Sin autenticación

const router = express.Router();

// Create new accommodation request (sin autenticación)
router.post('/', async (req, res) => {
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
      fechaPropuesta,
      studentId
    } = req.body;

    const course = await Course.findByPk(courseId, {
      include: [{ model: User, as: 'teacher' }]
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
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
      studentId: studentId, // Usar el studentId del request (requerido)
      courseId,
      teacherId: course.teacher.id
    });

    res.status(201).json(accommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all accommodations for a teacher with filtering
router.get('/teacher', async (req, res) => {
  try {
    const { type, status } = req.query;
    const whereClause = {}; // Sin autenticación, devolver todas
    
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
router.get('/student', async (req, res) => {
  try {
    const accommodations = await Accommodation.findAll({
      where: {}, // Sin autenticación, devolver todas
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
router.patch('/:id', async (req, res) => {
  try {
    const { status, teacherResponse } = req.body;
    const accommodation = await Accommodation.findByPk(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation request not found' });
    }

    // Sin verificación de autorización

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
router.get('/:id', async (req, res) => {
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
      false // Sin verificación de autorización
    ) {
      return res.status(403).json({ error: 'Not authorized to view this request' });
    }

    res.json(accommodation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete accommodation request
router.delete('/:id', async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ error: 'Accommodation request not found' });
    }

    await accommodation.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 