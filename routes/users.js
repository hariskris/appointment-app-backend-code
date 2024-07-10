const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Routes for user management
router.post("/signup", userController.signup);
router.post("/signin", userController.signin);
router.delete("/:userId", userController.deleteUser);

module.exports = router;
