// Import the Express framework - a minimal web application framework for Node.js
const express = require("express");

// Import the database connection pool for PostgreSQL database operations
const pool = require("./db");

// Import CORS (Cross-Origin Resource Sharing) middleware to handle cross-origin requests
const cors = require("cors");

// Import authentication routes module that handles user signup, login, and auth-related endpoints
const authRoutes = require("./routes/auth");

// Import book routes module that handles all book-related CRUD operations
const bookRoutes = require("./routes/bookRoutes");

// Load environment variables from .env file into process.env
require("dotenv").config();

// Import Node.js built-in path module for handling and transforming file paths
const path = require("path");

// Create an instance of the Express application
const app = express();

// Set the server port from environment variable PORT, or default to 5000 if not specified
const PORT = process.env.PORT || 5000;

// Configure CORS middleware to allow cross-origin requests
app.use(cors({
  origin: "http://localhost:5173"
}));
// Add middleware to parse incoming JSON payloads in request bodies
app.use(express.json());

// Mount authentication routes at the /api/auth path
// This means all routes in authRoutes will be prefixed with /api/auth
app.use("/api/auth", authRoutes);

// Mount book-related routes at the /api/books path
// This means all routes in bookRoutes will be prefixed with /api/books
app.use("/api/books", bookRoutes);

// Start the Express server and listen on the specified PORT
app.listen(PORT, () => {
    // Log a message to the console when the server starts successfully
    console.log(`Server running at http://localhost:${PORT}`);
});