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

// Create absence (ESTUDIANTES pueden avisar faltas futuras, PROFESORES registran faltas después)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { studentId, courseId, fecha, motivo, tipo } = req.body;

    // Validar que courseId esté presente
    if (!courseId) {
      return res.status(400).json({ error: 'courseId es requerido' });
    }

    // Verificar que el curso exista
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Si es estudiante, crear aviso de falta futura (tipo 'prevista')
    if (req.user.role === 'student') {
      const absence = await Absence.create({
        studentId: req.user.id,
        courseId,
        fecha,
        motivo: motivo || '',
        tipo: 'prevista',
        teacherId: course.teacherId
      });

      const absenceWithDetails = await Absence.findByPk(absence.id, {
        include: [
          { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
          { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
          { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
        ]
      });

      return res.status(201).json(absenceWithDetails);
    }

    // Si es profesor o admin, registrar falta después (tipo 'justificada' o 'injustificada')
    if (req.user.role === 'teacher' || req.user.role === 'admin') {
      if (!studentId) {
        return res.status(400).json({ error: 'studentId es requerido para registrar faltas' });
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
        fecha,
        motivo: motivo || '',
        tipo: tipo || 'injustificada',
        teacherId: req.user.id
      });

      const absenceWithDetails = await Absence.findByPk(absence.id, {
        include: [
          { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
          { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
          { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
        ]
      });

      return res.status(201).json(absenceWithDetails);
    }

    res.status(403).json({ error: 'No tienes permisos para registrar ausencias' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update absence status (SOLO PROFESOR que registró la falta)
router.patch('/:id', authenticateToken, authorizeRole('teacher', 'admin'), async (req, res) => {
  try {
    const { tipo, observaciones } = req.body; // 'justificada' o 'injustificada'

    const absence = await Absence.findByPk(req.params.id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ]
    });

    if (!absence) {
      return res.status(404).json({ error: 'Ausencia no encontrada' });
    }

    // Si es profesor, verificar que sea de uno de sus cursos
    if (req.user.role === 'teacher') {
      const course = await Course.findByPk(absence.courseId);
      if (course.teacherId !== req.user.id) {
        return res.status(403).json({ 
          error: 'No puedes actualizar ausencias de cursos que no enseñas' 
        });
      }
    }

    const updateData = {};
    if (tipo && ['justificada', 'injustificada', 'prevista'].includes(tipo)) {
      updateData.tipo = tipo;
    }
    if (observaciones) {
      updateData.observaciones = observaciones;
    }

    await absence.update(updateData);

    const updatedAbsence = await Absence.findByPk(req.params.id, {
      include: [
        { model: User, as: 'student', attributes: ['id', 'name', 'email', 'studentId'] },
        { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
        { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.json(updatedAbsence);
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
