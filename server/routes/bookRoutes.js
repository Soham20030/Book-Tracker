// Import Express framework and initialize the router
const express = require("express");
const router = express.Router();

// Import controller functions related to book operations
const {
  createBook,
  deleteBook,
  updateBook,
  getBookByUser,
  getBookById,
  getBooksByUsername
} = require("../controllers/bookController");

// Import the middleware to verify JWT token
const verifyToken = require("../middleware/verifyToken");


// ========================= ROUTES ========================= //

// 📘 Create a new book entry
// Protected route: requires valid JWT
router.post("/", verifyToken, createBook);

// ❌ Delete a book by ID
// Protected route
router.delete("/:id", verifyToken, deleteBook);

// 🔄 Update a book by ID
// Protected route
router.put("/:id", verifyToken, updateBook);

// 📚 Get all books of the currently logged-in user
// Protected route
router.get("/", verifyToken, getBookByUser);

// 📖 Get a specific book by its ID
// Protected route
router.get("/:id", verifyToken, getBookById);

// 🔍 Get all books by a specific username
// Public route (does not require token)
router.get("/user/:username", getBooksByUsername);


// Export the router to be used in the main server file
module.exports = router;
