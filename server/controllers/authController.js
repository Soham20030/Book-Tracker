const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Signup hit", username);

  try {
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    res.status(201).json({ user: newUser.rows[0] });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
};



const login = async(req,res) => {
    const {email, password} = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);


        if(user.rows.length ===0){
            return res.status(401).json({error: "No such user exists"});
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if(!validPassword){
            return res.status(401).json({error: "Invalid Credentials"});
        }

        const token = jwt.sign(
            {id: user.rows[0].id, email: user.rows[0].email},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );

        res.status(200).json({token});

    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({error:"Server error during login"});
    }
};

















module.exports = { signup, login};
