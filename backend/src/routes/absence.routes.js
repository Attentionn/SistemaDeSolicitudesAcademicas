const express = require('express');
const { Absence, User, Course } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Get absences by student (ESTUDIANTE ve sus propias ausencias, ADMIN/TEACHER ven todas)
router.get('/student', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.query;
    
    let whereClause = {};
    
    if (req.user.role === 'student') {
      // Estudiante solo ve sus propias ausencias
      whereClause.studentId = req.user.id;
    } else if (req.user.role === 'teacher' || req.user.role === 'admin') {
      // Teacher/Admin pueden filtrar por studentId o ver todas
      if (studentId) {
        whereClause.studentId = studentId;
      }
    }

    const absences = await Absence.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.json(absences);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get absences by teacher (PROFESOR ve ausencias de sus cursos, ADMIN ve todas)
router.get('/teacher', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const { teacherId } = req.query;
    
    let whereClause = {};
    
    if (req.user.role === 'teacher') {
      // Profesor solo ve ausencias que ÉL registró
      whereClause.teacherId = req.user.id;
    } else if (req.user.role === 'admin' && teacherId) {
      // Admin puede filtrar por profesor
      whereClause.teacherId = teacherId;
    }

    const absences = await Absence.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.json(absences);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create absence (SOLO PROFESORES pueden crear ausencias)
router.post('/', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const { studentId, courseId, fecha, materia, motivo, tipo, observaciones } = req.body;

    // Verificar que el curso exista
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Si es profesor, verificar que sea SU curso
    if (req.user.role === 'teacher' && course.teacherId !== req.user.id) {
      return res.status(403).json({ 
        error: 'No puedes crear ausencias en cursos que no enseñas' 
      });
    }

    // Verificar que el estudiante exista
    const student = await User.findOne({ 
      where: { id: studentId, role: 'student' } 
    });
    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    const absence = await Absence.create({
      studentId,
      courseId,
      teacherId: req.user.id, // El profesor que la crea
      fecha,
      materia,
      motivo,
      tipo,
      observaciones
    });

    const absenceWithDetails = await Absence.findByPk(absence.id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.status(201).json(absenceWithDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete absence (SOLO PROFESOR que la creó o ADMIN)
router.delete('/:id', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const absence = await Absence.findByPk(req.params.id);

    if (!absence) {
      return res.status(404).json({ error: 'Ausencia no encontrada' });
    }

    // Si es profesor, verificar que ÉL la creó
    if (req.user.role === 'teacher' && absence.teacherId !== req.user.id) {
      return res.status(403).json({ 
        error: 'No puedes eliminar ausencias que no creaste' 
      });
    }

    await absence.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
