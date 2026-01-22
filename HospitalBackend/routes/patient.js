const express = require("express");
const router = express.Router();

const {
  createPatient,
  getAllPatients,
} = require("../controllers/patientController");

// POST /api/patients → create patient
router.post("/", createPatient);

// GET /api/patients → get all patients
router.get("/", getAllPatients);

module.exports = router;
