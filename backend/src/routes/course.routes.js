const express = require('express');
const { Course, User } = require('../models');

const router = express.Router();

// Create new course (sin autenticación)
router.post('/', async (req, res) => {
  try {
    const { name, code, description, schedule, classroom } = req.body;

    const existingCourse = await Course.findOne({ where: { code } });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course code already exists' });
    }

    const course = await Course.create({
      name,
      code,
      description,
      schedule,
      classroom,
      teacherId: 1 // Usar el primer profesor disponible
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: User, as: 'teacher' }]
    });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get courses by teacher (sin autenticación)
router.get('/teacher', async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: User, as: 'teacher' }]
    });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get courses for student (sin autenticación)
router.get('/student', async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: User, as: 'teacher' }]
    });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{ model: User, as: 'teacher' }]
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update course (sin autenticación)
router.patch('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Sin verificación de autorización

    const { name, description, schedule, classroom } = req.body;
    await course.update({
      name,
      description,
      schedule,
      classroom
    });

    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete course (sin autenticación)
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Sin verificación de autorización

    await course.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 