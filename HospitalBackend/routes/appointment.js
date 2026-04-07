const express = require("express");
const router = express.Router();

// ✅ IMPORT CORRECTLY
const { protect, authorize } = require("../middleware/authMiddleware");

// Import controller functions
const { 
  getAllAppointments, 
  bookAppointment,
  acceptAppointment,
  deleteAppointment
} = require("../controllers/appointmentController");


// 🔥 GET → doctor / patient / admin
router.get("/", protect, getAllAppointments);


// 🔥 POST → ONLY patient can book
router.post("/", protect, authorize("patient"), bookAppointment);


// ✅ ACCEPT → ONLY doctor
router.put("/:id/accept", protect, authorize("doctor"), acceptAppointment);


// ❌ DECLINE → ONLY doctor
router.delete("/:id", protect, authorize("doctor"), deleteAppointment);


module.exports = router;