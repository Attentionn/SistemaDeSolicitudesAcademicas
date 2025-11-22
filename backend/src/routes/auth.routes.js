const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register new user (SOLO ADMINS CON JWT)
router.post('/register', authenticateToken, authorizeRole('admin'), async (req, res) => {
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
      studentId,
      faculty
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        faculty: user.faculty
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  console.log('📩 Body completo:', req.body);
  console.log('📧 Email:', req.body.email);
  console.log('🔑 Password:', req.body.password);
  
  try {
    const { email, password } = req.body;
    
    console.log('🔍 Buscando usuario con email:', email); // ← NUEVO
    console.log('📊 User model:', User); // ← NUEVO
    
    const user = await User.findOne({ where: { email } });
    
    console.log('👤 Usuario encontrado:', user); // ← NUEVO
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        faculty: user.faculty
      }
    });
  } catch (error) {
    console.log('❌ Error completo:', error); // ← NUEVO
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;