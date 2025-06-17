// Import the jsonwebtoken library for decoding and verifying JWTs
const jwt = require("jsonwebtoken");

// Middleware function to verify JWT tokens in incoming requests
const verifyToken = (req, res, next) => {
    console.log("Authorization header:", req.headers.authorization); // Debug log

    const authHeader = req.headers.authorization;

    // ✅ Check if the Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // 🔐 Extract the token from the "Bearer <token>" format
    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token); // Debug log

    try {
        // ✅ Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 🧑 Attach user data (from token payload) to the request object
        req.user = decoded;

        // ✅ Move to the next middleware or route
        next();
    } catch (error) {
        // ❌ If token is invalid or expired
        return res.status(403).json({ error: "Invalid token" });
    }
};

// Export the middleware to be used in protected routes
module.exports = verifyToken;
