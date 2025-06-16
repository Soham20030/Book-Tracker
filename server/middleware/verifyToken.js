const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization;

    //Check if the token exists and starts with "Bearer"

    if(!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ error: "Unauthorized: No token provided"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to the request object
        next(); // Pass control to the next middleware/route
    } catch (error) {
        return res.status(403).json({error: "Invalid token"});
    }
};

module.exports = verifyToken;