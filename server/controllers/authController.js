// Import required modules
const pool = require("../db"); // PostgreSQL connection pool
const bcrypt = require("bcrypt"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For generating JWT tokens

// ============================
// SIGNUP CONTROLLER
// ============================
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Signup hit", username);

  try {
    // 🔍 Check if user already exists (by email or username)
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 🔐 Hash the user's password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 📝 Insert new user into database and return limited fields
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    // 🎟️ Generate JWT token (expires in 1 hour)
    const token = jwt.sign(
      { id: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 📦 Send back the token and username
    res.status(201).json({ token, username: newUser.rows[0].username });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
};

// ============================
// LOGIN CONTROLLER
// ============================
const login = async(req, res) => {
  const { email, password } = req.body;

  try {
    // 🔍 Check if user with the given email exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "No such user exists" });
    }

    // 🔐 Compare input password with stored hashed password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    // 🎟️ Generate and send JWT token
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });

  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
};

// Export both controllers
module.exports = { signup, login };
