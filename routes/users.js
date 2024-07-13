const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkAuth = require('../middleware/check-auth');

// Routes for user management
router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.delete("/deleteUser", checkAuth,userController.deleteUser);

module.exports = router;
