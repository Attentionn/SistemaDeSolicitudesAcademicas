const express = require('express');
const { Absence, Accommodation, Course, User } = require('../models');
// Sin autenticación

const router = express.Router();

// Get all requests for admins (all requests in the system)
router.get('/admin', async (req, res) => {
  try {
    const { status, type } = req.query;
    
    // Get all absences
    const absenceWhere = {};
    if (status) {
      absenceWhere.status = status;
    }
    
    const absences = await Absence.findAll({
      where: absenceWhere,
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: Course, as: 'course' }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get all accommodations
    const accommodationWhere = {};
    if (status) {
      accommodationWhere.status = status;
    }
    if (type) {
      accommodationWhere.type = type;
    }
    
    const accommodations = await Accommodation.findAll({
      where: accommodationWhere,
      include: [
        { model: User, as: 'student' },
        { model: User, as: 'teacher' },
        { model: Course, as: 'course' }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform data to unified format
    const allRequests = [
      ...absences.map(absence => ({
        id: absence.id,
        type: 'absence',
        student: absence.student,
        teacher: absence.teacher,
        course: absence.course,
        status: absence.status || 'pending',
        motivo: absence.motivo,
        createdAt: absence.createdAt,
        updatedAt: absence.updatedAt,
        teacherComment: absence.observaciones,
        // Absence specific fields
        fecha: absence.fecha,
        materia: absence.materia,
        tipo: absence.tipo
      })),
      ...accommodations.map(accommodation => ({
        id: accommodation.id,
        type: 'accommodation',
        student: accommodation.student,
        teacher: accommodation.teacher,
        course: accommodation.course,
        status: accommodation.status || 'pending',
        motivo: accommodation.motivo,
        description: accommodation.description,
        createdAt: accommodation.createdAt,
        updatedAt: accommodation.updatedAt,
        teacherComment: accommodation.teacherResponse,
        // Accommodation specific fields
        requestedDate: accommodation.requestedDate,
        newDate: accommodation.newDate,
        newClassroom: accommodation.newClassroom,
        extensionDays: accommodation.extensionDays
      }))
    ];

    // Sort by creation date
    allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all requests for a teacher (both absences and accommodations)
router.get('/teacher', async (req, res) => {
  try {
    const { status, type } = req.query;
    
    // Get absences (sin autenticación, devolver todas)
    const absenceWhere = {};
    if (status) {
      absenceWhere.status = status;
    }
    
    const absences = await Absence.findAll({
      where: absenceWhere,
      include: [
        { model: User, as: 'student' },
        { model: Course, as: 'course' }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get accommodations (sin autenticación, devolver todas)
    const accommodationWhere = {};
    if (status) {
      accommodationWhere.status = status;
    }
    if (type) {
      accommodationWhere.type = type;
    }
    
    const accommodations = await Accommodation.findAll({
      where: accommodationWhere,
      include: [
        { model: User, as: 'student' },
        { model: Course, as: 'course' }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform data to unified format
    const allRequests = [
      ...absences.map(absence => ({
        id: absence.id,
        type: 'absence',
        student: absence.student,
        course: absence.course,
        status: absence.status || 'pending',
        motivo: absence.motivo,
        createdAt: absence.createdAt,
        updatedAt: absence.updatedAt,
        teacherComment: absence.observaciones,
        // Absence specific fields
        fecha: absence.fecha,
        materia: absence.materia,
        tipo: absence.tipo
      })),
      ...accommodations.map(accommodation => ({
        id: accommodation.id,
        type: 'accommodation',
        student: accommodation.student,
        course: accommodation.course,
        status: accommodation.status || 'pending',
        motivo: accommodation.motivo,
        description: accommodation.description,
        createdAt: accommodation.createdAt,
        updatedAt: accommodation.updatedAt,
        teacherComment: accommodation.teacherResponse,
        // Accommodation specific fields
        requestedDate: accommodation.requestedDate,
        newDate: accommodation.newDate,
        newClassroom: accommodation.newClassroom,
        extensionDays: accommodation.extensionDays
      }))
    ];

    // Sort by creation date
    allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Approve a request (works for both absences and accommodations)
router.patch('/:id/approve', async (req, res) => {
  try {
    const { teacherComment } = req.body;
    const { id } = req.params;
    
    // Try to find in accommodations first
    let request = await Accommodation.findByPk(id);
    let isAccommodation = true;
    
    if (!request) {
      // Try to find in absences
      request = await Absence.findByPk(id);
      isAccommodation = false;
    }
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Sin verificación de autorización

    // Update based on type
    if (isAccommodation) {
      await request.update({
        status: 'approved',
        teacherResponse: teacherComment
      });
    } else {
      await request.update({
        status: 'approved',
        observaciones: teacherComment
      });
    }

    res.json({ message: 'Request approved successfully', request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Reject a request (works for both absences and accommodations)
router.patch('/:id/reject', async (req, res) => {
  try {
    const { teacherComment } = req.body;
    const { id } = req.params;
    
    // Try to find in accommodations first
    let request = await Accommodation.findByPk(id);
    let isAccommodation = true;
    
    if (!request) {
      // Try to find in absences
      request = await Absence.findByPk(id);
      isAccommodation = false;
    }
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Sin verificación de autorización

    // Update based on type
    if (isAccommodation) {
      await request.update({
        status: 'rejected',
        teacherResponse: teacherComment
      });
    } else {
      await request.update({
        status: 'rejected',
        observaciones: teacherComment
      });
    }

    res.json({ message: 'Request rejected successfully', request });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all requests for a student
router.get('/student', async (req, res) => {
  try {
    // Get absences (sin autenticación, devolver todas)
    const absences = await Absence.findAll({
      where: {},
      include: [
        { model: User, as: 'teacher' },
        { model: Course, as: 'course' }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Get accommodations (sin autenticación, devolver todas)
    const accommodations = await Accommodation.findAll({
      where: {},
      include: [
        { model: User, as: 'teacher' },
        { model: Course, as: 'course' }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Transform data to unified format
    const allRequests = [
      ...absences.map(absence => ({
        id: absence.id,
        type: 'absence',
        teacher: absence.teacher,
        course: absence.course,
        status: absence.status || 'pending',
        motivo: absence.motivo,
        createdAt: absence.createdAt,
        updatedAt: absence.updatedAt,
        teacherComment: absence.observaciones,
        // Absence specific fields
        fecha: absence.fecha,
        materia: absence.materia,
        tipo: absence.tipo
      })),
      ...accommodations.map(accommodation => ({
        id: accommodation.id,
        type: 'accommodation',
        teacher: accommodation.teacher,
        course: accommodation.course,
        status: accommodation.status || 'pending',
        motivo: accommodation.motivo,
        description: accommodation.description,
        createdAt: accommodation.createdAt,
        updatedAt: accommodation.updatedAt,
        teacherComment: accommodation.teacherResponse,
        // Accommodation specific fields
        requestedDate: accommodation.requestedDate,
        newDate: accommodation.newDate,
        newClassroom: accommodation.newClassroom,
        extensionDays: accommodation.extensionDays
      }))
    ];

    // Sort by creation date
    allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
