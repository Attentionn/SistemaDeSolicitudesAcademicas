const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
// Sin autenticación

const router = express.Router();

// Get all users (sin autenticación)
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create user (sin autenticación)
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, studentId, faculty } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if studentId already exists (for students)
    if (role === 'student' && studentId) {
      const existingStudent = await User.findOne({ where: { studentId } });
      if (existingStudent) {
        return res.status(400).json({ error: 'Student ID already registered' });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      studentId: role === 'student' ? studentId : null,
      faculty
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user (sin autenticación)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, studentId, faculty, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if email already exists (excluding current user)
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
    }

    // Check if studentId already exists (for students, excluding current user)
    if (role === 'student' && studentId && studentId !== user.studentId) {
      const existingStudent = await User.findOne({ where: { studentId } });
      if (existingStudent) {
        return res.status(400).json({ error: 'Student ID already registered' });
      }
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      role,
      studentId: role === 'student' ? studentId : null,
      faculty
    };

    // Hash new password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Sin verificación de autorización

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update user profile
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Sin verificación de autorización

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

// Delete user (sin autenticación)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting admin
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