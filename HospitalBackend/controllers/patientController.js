const User = require("../models/User"); // ✅ Changed from 'Patient' to 'User'

// @desc    Get all patients (Users with role 'patient')
// @route   GET /api/patients
// @access  Public
exports.getAllPatients = async (req, res) => {
  try {
    // ✅ Look in User collection for role 'patient'
    const patients = await User.find({ role: "patient" }).select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length, // This number will now appear on your dashboard
      data: patients,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new patient (Admin/Manual add)
// @route   POST /api/patients
// @access  Public
exports.createPatient = async (req, res) => {
  try {
    // If we manually add a patient, we create a User with role 'patient'
    const user = await User.create({
      ...req.body,
      role: "patient"
    });

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};