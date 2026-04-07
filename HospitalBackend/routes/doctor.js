const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { protect, authorize } = require("../middleware/authMiddleware");

// @route   POST /api/doctors
// @desc    Create a new doctor
// @access  Admin
router.post("/", doctorController.createDoctor);

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get("/", doctorController.getAllDoctors);

// @route   GET /api/doctors/me
// @desc    Get current doctor profile
// @access  Doctor
router.get("/me", protect, authorize("doctor"), doctorController.getMyDoctorProfile);

// @route   PUT /api/doctors/me/availability
// @desc    Update current doctor availability
// @access  Doctor
router.put(
  "/me/availability",
  protect,
  authorize("doctor"),
  doctorController.updateMyAvailability
);

module.exports = router;