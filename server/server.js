const express = require("express");
const pool = require("./db");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/bookRoutes");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

//routes

app.use("/api/auth", authRoutes);

app.use("/api/books", bookRoutes);



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})