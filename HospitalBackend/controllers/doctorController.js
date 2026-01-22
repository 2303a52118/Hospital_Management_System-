const User = require("../models/User");

// @desc    Create new doctor (Admin Action)
// @route   POST /api/doctors
// @access  Admin
exports.createDoctor = async (req, res) => {
  try {
    // We force the role to 'doctor' so the Admin can't accidentally create a patient here
    const doctorData = {
      ...req.body,
      role: "doctor"
    };

    const doctor = await User.create(doctorData);

    // Remove password from response for security
    doctor.password = undefined;

    res.status(201).json({
      success: true,
      message: "Doctor account created successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getAllDoctors = async (req, res) => {
  try {
    // Filter the User collection for those with the role 'doctor'
    // .select("-password") ensures we don't leak hashes to the frontend
    const doctors = await User.find({ role: "doctor" })
      .select("-password") 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};