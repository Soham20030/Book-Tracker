const express = require("express");
const pool = require("./db");
const authRoutes = require("./routes/auth");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());

//routes

app.use("/api/auth", authRoutes);





app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})