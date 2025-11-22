const express = require('express');
const { Course, User } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Create new course (SOLO ADMINS)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, code, description, schedule, classroom, teacherId } = req.body;

    const existingCourse = await Course.findOne({ where: { code } });
    if (existingCourse) {
      return res.status(400).json({ error: 'Course code already exists' });
    }

    // Verificar que el profesor existe
    const teacher = await User.findOne({ 
      where: { id: teacherId, role: 'teacher' } 
    });
    
    if (!teacher) {
      return res.status(400).json({ error: 'Teacher not found or invalid role' });
    }

    const course = await Course.create({
      name,
      code,
      description,
      schedule,
      classroom,
      teacherId
    });

    // Retornar con información del profesor
    const courseWithTeacher = await Course.findByPk(course.id, {
      include: [{ model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json(courseWithTeacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courses (AUTENTICADO)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ 
        model: User, 
        as: 'teacher',
        attributes: ['id', 'name', 'email', 'faculty']
      }]
    });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get courses by teacher (PROFESORES ven sus cursos)
router.get('/teacher/:teacherId', authenticateToken, async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    // Verificar que el usuario es el profesor o es admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(teacherId)) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const courses = await Course.findAll({
      where: { teacherId },
      include: [{ 
        model: User, 
        as: 'teacher',
        attributes: ['id', 'name', 'email', 'faculty']
      }]
    });
    
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get courses for student (ESTUDIANTES ven todos los cursos disponibles)
router.get('/student', authenticateToken, authorizeRole('student'), async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ 
        model: User, 
        as: 'teacher',
        attributes: ['id', 'name', 'email', 'faculty']
      }]
    });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get course by ID (AUTENTICADO)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{ 
        model: User, 
        as: 'teacher',
        attributes: ['id', 'name', 'email', 'faculty']
      }]
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update course (SOLO ADMINS)
router.patch('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const { name, description, schedule, classroom, teacherId } = req.body;
    
    // Si se cambia el profesor, verificar que existe
    if (teacherId && teacherId !== course.teacherId) {
      const teacher = await User.findOne({ 
        where: { id: teacherId, role: 'teacher' } 
      });
      
      if (!teacher) {
        return res.status(400).json({ error: 'Teacher not found or invalid role' });
      }
    }

    await course.update({
      name,
      description,
      schedule,
      classroom,
      teacherId
    });

    // Retornar con información actualizada
    const updatedCourse = await Course.findByPk(course.id, {
      include: [{ model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }]
    });

    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete course (SOLO ADMINS)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await course.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;