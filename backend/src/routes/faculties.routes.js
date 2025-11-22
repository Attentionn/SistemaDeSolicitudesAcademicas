const express = require('express');
const { Faculty } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all faculties (PÚBLICO - cualquiera puede ver)
router.get('/', async (req, res) => {
  try {
    const faculties = await Faculty.findAll({
      order: [['name', 'ASC']]
    });
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get faculty by ID (PÚBLICO)
router.get('/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({ error: 'Facultad no encontrada' });
    }

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create faculty (SOLO ADMINS)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;

    // Verificar que no exista ya una facultad con ese nombre
    const existingFaculty = await Faculty.findOne({ where: { name } });
    if (existingFaculty) {
      return res.status(400).json({ error: 'Ya existe una facultad con ese nombre' });
    }

    const faculty = await Faculty.create({ name, description });
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update faculty (SOLO ADMINS)
router.patch('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;

    const faculty = await Faculty.findByPk(req.params.id);
    if (!faculty) {
      return res.status(404).json({ error: 'Facultad no encontrada' });
    }

    // Si se cambia el nombre, verificar que no exista otra con ese nombre
    if (name && name !== faculty.name) {
      const existingFaculty = await Faculty.findOne({ where: { name } });
      if (existingFaculty) {
        return res.status(400).json({ error: 'Ya existe una facultad con ese nombre' });
      }
    }

    await faculty.update({ name, description });
    res.json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete faculty (SOLO ADMINS)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({ error: 'Facultad no encontrada' });
    }

    await faculty.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;