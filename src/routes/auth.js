const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Authentication routes
router.get("/imagekit", authController.getImageKitAuth);

module.exports = router;
