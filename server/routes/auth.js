// Import the Express framework
const express = require("express");

// Create a new router instance from Express
const router = express.Router();

// Import controller functions for signup and login
const { signup, login } = require("../controllers/authController");

// Route to handle user signup (POST request to /signup)
router.post('/signup', signup);

// Route to handle user login (POST request to /login)
router.post("/login", login);

// Export the router so it can be used in the main server file
module.exports = router;
