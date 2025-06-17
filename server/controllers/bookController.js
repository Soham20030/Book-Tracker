// Import the PostgreSQL connection pool
const pool = require("../db");


// =============================
// 📘 CREATE A BOOK
// =============================
const createBook = async(req,res) => {
    const { title, author, status, review} = req.body;
    const userId = req.user.id; // Extracted from authenticated token middleware

    try {
        // Insert a new book into the database
        const newBook = await pool.query(
            `INSERT INTO books (user_id, title, author, status, review)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
             [userId, title, author, status, review]
        );

        res.status(201).json(newBook.rows[0]); // Return the newly created book
    } catch(error) {
        console.error("Create Book Error", error);
        res.status(500).json({error: "Server error while creating book"});
    }
};


// =============================
// 🗑️ DELETE A BOOK
// =============================
const deleteBook = async(req, res) => {
    const bookId = req.params.id;
    const userId = req.user.id;

    try {
        // Check if the book exists
        const book = await pool.query("SELECT * FROM books WHERE id = $1", [bookId]);

        if(book.rows.length === 0){
            return res.status(404).json({error: "Book not found"});
        }

        // Ensure the book belongs to the current user
        if(book.rows[0].user_id !== userId) {
            return res.status(403).json({error:"Unauthorized to delete this book"});
        }

        // Delete the book
        await pool.query("DELETE FROM books WHERE id = $1", [bookId]);
        res.status(200).json({message:"Book deleted successfully"});
    } catch (error) {
        console.error("Delete Book Error:", error);
        res.status(500).json({error:"Server error while deleting book"});
    }
};


// =============================
// ✏️ UPDATE A BOOK
// =============================
const updateBook = async (req,res) => {
    const bookId = req.params.id;
    const userId = req.user.id;
    const { title, author, status, review } = req.body;

    try {
        // Confirm the book exists and belongs to the user
        const book = await pool.query(
            "SELECT * FROM books WHERE id = $1 AND user_id = $2",
            [bookId, userId]
        );

        if(book.rows.length === 0){
            return res.status(404).json({error:"Book not found or not authorized"});
        }

        // Update the book's fields
        await pool.query(
            `UPDATE books
            SET title = $1, author = $2, status = $3, review = $4
            WHERE id = $5 AND user_id = $6`,
            [title, author, status, review, bookId, userId]
        );

        res.status(200).json({message: "Book updated successfully"});
    } catch (error) {
        console.error("Update book error:", error);
        res.status(500).json({error:"Server error while updating book"});
    }
};


// =============================
// 📚 GET ALL BOOKS OF A USER
// =============================
const getBookByUser = async(req,res) => {
    try {
        const userId = req.user.id;

        // Fetch books created by the current user, latest first
        const result = await pool.query(
            "SELECT * FROM books WHERE user_id = $1 ORDER BY id DESC",
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching Books:", error);
        res.status(500).json({error:"Server error while fetching books"});
    }
};


// =============================
// 📖 GET A SINGLE BOOK BY ID
// =============================
const getBookById = async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user.id;

  try {
    // Get a specific book by ID and confirm it belongs to user
    const result = await pool.query(
      "SELECT * FROM books WHERE id = $1 AND user_id = $2",
      [bookId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get Book By ID Error:", error);
    res.status(500).json({ error: "Server error while fetching book" });
  }
};


// =============================
// 👤 GET ALL BOOKS BY USERNAME
// =============================
const getBooksByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // 🔍 Find user ID from username
    const userResult = await pool.query("SELECT id FROM users WHERE username = $1", [username]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userResult.rows[0].id;

    // 🧾 Fetch all books of that user
    const books = await pool.query(
      "SELECT * FROM books WHERE user_id = $1 ORDER BY id DESC",
      [userId]
    );

    res.json(books.rows);
  } catch (error) {
    console.error("Error fetching books by username:", error);
    res.status(500).json({ error: "Server error while fetching books by username" });
  }
};


// Export all controller functions
module.exports = {
  createBook,
  deleteBook,
  updateBook,
  getBookByUser,
  getBookById,
  getBooksByUsername,
};
