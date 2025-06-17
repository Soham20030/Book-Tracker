// Import required modules
const express = require("express");                // Express framework for building API
const pool = require("./db");                      // PostgreSQL connection pool
const cors = require("cors");                      // Enables Cross-Origin Resource Sharing
const authRoutes = require("./routes/auth");       // Authentication routes (signup, login)
const bookRoutes = require("./routes/bookRoutes"); // Book-related routes
require("dotenv").config();                        // Loads environment variables from .env file
const path = require("path");                      // Node.js module to handle file paths

// Create an Express application instance
const app = express();

// Define the port from environment variable or use 5000 as fallback
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());               // Allow requests from different origins (important for frontend-backend communication)
app.use(express.json());       // Parse incoming JSON requests

// Route handling
app.use("/api/auth", authRoutes);    // All auth-related endpoints (e.g., /signup, /login) prefixed with /api/auth
app.use("/api/books", bookRoutes);   // All book-related endpoints (e.g., /create, /delete) prefixed with /api/books

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
