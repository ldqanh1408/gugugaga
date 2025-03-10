const {verifyToken} = require("../utils/jwtHelper")
const dotenv = require("dotenv");
dotenv.config();
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "
    var decoded;
    try {
        decoded = verifyToken(token);
        
        req.user = decoded;
        next();
    }
    catch(error) {
        // console.log(decoded);

        return res.status(403).json({ message: "Forbidden - Invalid token" + error.message });
    }
}

module.exports = authenticateJWT;