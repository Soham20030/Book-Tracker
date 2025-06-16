const pool = require("../db");


// Logic behind Creating a Book

const createBook = async(req,res) => {
    const { title, author, status, review} = req.body;
    const userId = req.user.id;

    try {
        const newBook = await pool.query(
            `INSERT INTO books (user_id, title, author, status, review)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
             [userId, title, author, status, review]
        );

        res.status(201).json(newBook.rows[0]);
    } catch(error) {
        console.error("Create Book Error", error);
        res.status(500).json({error: "Server error while creating book"});
    }
};



//Logic Behind Deleteing A Book

const deleteBook = async(req, res) => {
    const bookId = req.params.id;
    const userId = req.user.id;

    try {
        const book = await pool.query("SELECT * FROM books WHERE id = $1", [bookId]);

        if(book.rows.length === 0){
            return res.status(404).json({error: "Book not found"});
        }

        if(book.rows[0].user_id !== userId) {
            return res.status(403).json({error:"Unauthorized to delete this book"});
        }

        await pool.query("DELETE FROM books WHERE id = $1", [bookId]);
        res.status(200).json({message:"Book deleted successfully"});
    } catch (error) {
        console.error("Delete Book Error:", error);
        res.status(500).json({error:"Server error while deleting book"});
    }
};


//Logic Behind Updating A Book

const updateBook = async (req,res) => {
    const bookId = req.params.id;
    const userId = req.user.id
    const {title, author, status, review} = req.body;

    try {
        const book = await pool.query(
            "SELECT * FROM books WHERE id = $1 AND user_id = $2",
            [bookId, userId]
        );

        if(book.rows.length ===0){
            return res.status(404).json({error:"Book not found or not authorized"});
        }

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


module.exports = { createBook, deleteBook, updateBook};