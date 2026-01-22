const Appointment = require("../models/Appointment");

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
exports.getAllAppointments = async (req, res) => {
  try {
    // .populate() swaps the IDs for the actual Name/Email of the person
    const appointments = await Appointment.find()
      .populate("patient", "name email") 
      .populate("doctor", "name specialization");

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book an appointment
// @route   POST /api/appointments
exports.bookAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};