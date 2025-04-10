const {verifyToken, verifyTokenForBusiness, verifyTokenForExpert} = require("../utils/jwtHelper")
const dotenv = require("dotenv");
dotenv.config();
const authenticateJWT = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "
    let decoded;
    try {
        decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch(error) {

        return res.status(403).json({ message: "Forbidden - Invalid token" + error.message });
    }
}

const authenticateBusinessJWT = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "
    let decoded;
    try {
        decoded = verifyTokenForBusiness(token);
        req.business = decoded;
        next();
    }
    catch(error) {

        return res.status(403).json({ message: "Forbidden - Invalid token" + error.message });
    }
}


const authenticateExpertJWT = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "
    let decoded;
    try {
        decoded = verifyTokenForExpert(token);
        req.expert = decoded;
        next();
    }
    catch(error) {

        return res.status(403).json({ message: "Forbidden - Invalid token" + error.message });
    }
}

module.exports = {authenticateJWT, authenticateBusinessJWT, authenticateExpertJWT};