const {
  verifyToken,
  verifyTokenForBusiness,
  verifyTokenForExpert,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
} = require("../utils/jwtHelper");
const jwtHelper = require("../utils/jwtHelper")
const redisHelper = require("../utils/redisHelper");
const dotenv = require("dotenv");
dotenv.config();
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "
  if (!token)
    return res.status(401).json({ success: false, message: "Found not token" });

  let decoded;
  try {
    decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden - Invalid token" + error.message });
  }
};

const authenticateBusinessJWT = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "
  let decoded;
  try {
    decoded = verifyTokenForBusiness(token);
    req.business = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden - Invalid token" + error.message });
  }
};

const authenticateExpertJWT = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "
  let decoded;
  try {
    decoded = verifyTokenForExpert(token);
    req.expert = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden - Invalid token" + error.message });
  }
};

const authenticateJWT_V2 = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "
  let decoded;
  try {
    decoded = verifyAccessToken(token);
    req.payload = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Forbidden - Invalid token" + error.message });
  }
};

const authenticateAndAuthorize = (roles = []) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)  
          .json({ message: "Unauthorized - No token provided" });
      }
      const token = authHeader.split(" ")[1]; // Lấy phần token sau "Bearer "
      if (!token) {
        return res.status(401).json("Access Denied");
      }

      // Kiểm tra xem token có bị blacklist không
      const isBlacklisted = await redisHelper.isBlacklisted(token);
      if (isBlacklisted) {
        return res.status(403).send("Token is blacklisted");
      }

      const decoded = await jwtHelper.verifyAccessToken(token);
      
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden - Insufficient role" });
      }

      req.payload = decoded;

      next();
    } catch (error) {
      return res
        .status(403)
        .json({ message: "Forbidden - Invalid token" + error.message });
    }
  };
};

module.exports = {
  authenticateJWT,
  authenticateBusinessJWT,
  authenticateExpertJWT,
  authenticateJWT_V2,
  authenticateAndAuthorize
};
