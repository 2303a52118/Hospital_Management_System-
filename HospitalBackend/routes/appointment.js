const express = require("express");
const router = express.Router();

// Import the specific functions we defined in the controller
const { 
  getAllAppointments, 
  bookAppointment 
} = require("../controllers/appointmentController");

// @route   GET /api/appointments
// @desc    Get all appointments (Admin)
router.get("/", getAllAppointments);

// @route   POST /api/appointments
// @desc    Book an appointment (Patient)
router.post("/", bookAppointment);

module.exports = router;