const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const checkAuth = require('../middleware/check-auth');

// Routes for appointments
router.get('/', checkAuth, appointmentController.getAppointments);
router.post('/', checkAuth, appointmentController.createAppointment);
router.put('/:appointmentId', checkAuth, appointmentController.updateAppointment);
router.delete('/:appointmentId', checkAuth, appointmentController.deleteAppointment);

module.exports = router;

