const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

// Create express app
const app = express();

// ====== MIDDLEWARE ======
app.use(express.json());
app.use(cors());
app.use(helmet());

// ====== DATABASE CONNECTION ======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ====== ROUTES ======
const patientRoutes = require("./routes/patient.js");
const doctorRoutes = require("./routes/doctor.js");
const appointmentRoutes = require("./routes/appointment.js");
const authRoutes = require("./routes/auth.js"); // ✅ Added Auth Route

app.get("/", (req, res) => {
  res.send("Hospital Backend API is running");
});

app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes); // ✅ Added Auth Endpoint

// EXPORT APP (IMPORTANT)
module.exports = app;
// ====== START SERVER ======
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});