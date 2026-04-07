const Appointment = require("../models/Appointment");
const User = require("../models/User");

const toMinutes = (timeStr = "00:00") => {
  const [hh, mm] = String(timeStr).split(":");
  return Number(hh || 0) * 60 + Number(mm || 0);
};

const isWithinAvailability = (appointmentDate, availabilityStart, availabilityEnd) => {
  const d = new Date(appointmentDate);
  const appointmentMinutes = d.getHours() * 60 + d.getMinutes();
  const start = toMinutes(availabilityStart);
  const end = toMinutes(availabilityEnd);
  return appointmentMinutes >= start && appointmentMinutes <= end;
};


// @desc    Get appointments (role-based)
// @route   GET /api/appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = {};

    // 🔥 ROLE-BASED FILTERING
    if (role === "doctor") {
      query.doctor = userId;
    } 
    else if (role === "patient") {
      query.patient = userId;
    }
    // admin → gets all

    const appointments = await Appointment.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name specialization availabilityStart availabilityEnd");

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Book an appointment
// @route   POST /api/appointments
exports.bookAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, reason } = req.body;
    const doctorUser = await User.findById(doctor);

    if (!doctorUser || doctorUser.role !== "doctor") {
      return res.status(404).json({
        success: false,
        message: "Selected doctor not found",
      });
    }

    if (
      !isWithinAvailability(
        appointmentDate,
        doctorUser.availabilityStart,
        doctorUser.availabilityEnd
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Doctor is available only between ${doctorUser.availabilityStart} and ${doctorUser.availabilityEnd}`,
      });
    }

    const appointment = await Appointment.create({
      doctor,
      patient: req.user.id,   // ✅ secure (from token)
      appointmentDate,
      reason,
      status: "pending"       // ✅ default
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};



// @desc    Accept appointment (Doctor)
// @route   PUT /api/appointments/:id/accept
exports.acceptAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate(
      "doctor",
      "availabilityStart availabilityEnd"
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (String(appointment.doctor._id) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this appointment",
      });
    }

    if (
      !isWithinAvailability(
        appointment.appointmentDate,
        appointment.doctor.availabilityStart,
        appointment.doctor.availabilityEnd
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot accept outside availability (${appointment.doctor.availabilityStart} - ${appointment.doctor.availabilityEnd})`,
      });
    }

    appointment.status = "accepted";
    await appointment.save();

    res.json({ success: true, data: appointment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Decline appointment (Doctor → delete)
// @route   DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (String(appointment.doctor) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to decline this appointment",
      });
    }

    await appointment.deleteOne();

    res.json({
      success: true,
      message: "Appointment removed"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};