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
    res.status(400).json({ error: error.message });
  }
});

// Get faculty by ID (PÚBLICO - cualquiera puede ver)
router.get('/:id', async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    res.json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create faculty (SOLO ADMIN)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const existingFaculty = await Faculty.findOne({ where: { name } });
    if (existingFaculty) {
      return res.status(400).json({ error: 'Faculty already exists' });
    }
    
    const faculty = await Faculty.create({ name, description });
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update faculty (SOLO ADMIN)
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const faculty = await Faculty.findByPk(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    if (name !== faculty.name) {
      const existingFaculty = await Faculty.findOne({ where: { name } });
      if (existingFaculty) {
        return res.status(400).json({ error: 'Faculty name already exists' });
      }
    }
    
    await faculty.update({ name, description });
    res.json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete faculty (SOLO ADMIN)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    await faculty.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;