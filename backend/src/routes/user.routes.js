const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

const router = express.Router();

// ⚠️ TODAS las rutas requieren autenticación
// Solo admins pueden gestionar usuarios

// Get all users (con filtro opcional por rol)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { role } = req.query; // Filtro opcional
    
    const whereClause = {};
    if (role) {
      whereClause.role = role;
    }
    
    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']]
    });
    
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create user (solo admin)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, email, password, role, studentId, faculty } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    if (role === 'student' && studentId) {
      const existingStudent = await User.findOne({ where: { studentId } });
      if (existingStudent) {
        return res.status(400).json({ error: 'Student ID already registered' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      studentId: role === 'student' ? studentId : null,
      faculty
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user by ID (usuarios autenticados pueden ver su propio perfil, admin puede ver todos)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Solo admin o el mismo usuario pueden ver el perfil
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user (solo admin puede actualizar cualquier usuario, usuarios pueden actualizar su propio perfil)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, studentId, faculty, password } = req.body;

    // Solo admin o el mismo usuario pueden actualizar
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Solo admin puede cambiar roles
    if (role && role !== user.role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can change roles' });
    }

    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    if (role === 'student' && studentId && studentId !== user.studentId) {
      const existingStudent = await User.findOne({ where: { studentId } });
      if (existingStudent) {
        return res.status(400).json({ error: 'Student ID already registered' });
      }
    }

    const updateData = {
      name,
      email,
      role: req.user.role === 'admin' ? role : user.role, // Solo admin puede cambiar rol
      studentId: role === 'student' ? studentId : null,
      faculty
    };

    if (password) {
      updateData.password = password;
    }

    await user.update(updateData);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user profile (usuarios pueden actualizar su propio perfil sin cambiar rol)
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    // Solo el mismo usuario puede actualizar su perfil
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, email, studentId, faculty } = req.body;
    await user.update({
      name,
      email,
      studentId,
      faculty
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      faculty: user.faculty
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user (solo admin)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;