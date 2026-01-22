const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");

// @route   POST /api/doctors
// @desc    Create a new doctor
// @access  Admin
router.post("/", doctorController.createDoctor);

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get("/", doctorController.getAllDoctors);

module.exports = router;