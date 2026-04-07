const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  register,
  login,
  getMe,
  updateDetails,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/updatedetails", protect, updateDetails);

module.exports = router;