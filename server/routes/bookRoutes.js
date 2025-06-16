const express = require("express");
const router = express.Router();
const {createBook, deleteBook, updateBook} = require("../controllers/bookController");
const verifyToken = require("../middleware/verifyToken");


//Route to create a Book

router.post("/", verifyToken, createBook);

router.delete("/:id", verifyToken, deleteBook);

router.put("/:id", verifyToken, updateBook);

module.exports = router;