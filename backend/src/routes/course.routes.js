const express = require('express');
const { Course, User } = require('../models');
const { auth, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Create new course (teachers only)
router.post('/', auth, checkRole(['teacher']), async (req, res) => {
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
      teacherId: req.user.id
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: User, as: 'teacher' }]
    });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get courses by teacher
router.get('/teacher', auth, checkRole(['teacher']), async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { teacherId: req.user.id }
    });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get courses for student (all courses for now, in a real app this would be filtered by enrollment)
router.get('/student', auth, checkRole(['student']), async (req, res) => {
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
router.get('/:id', auth, async (req, res) => {
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

// Update course (teachers only)
router.patch('/:id', auth, checkRole(['teacher']), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

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

// Delete course (teachers only)
router.delete('/:id', auth, checkRole(['teacher']), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.teacherId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    await course.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 