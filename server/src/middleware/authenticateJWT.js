const {
  verifyToken,
  verifyTokenForBusiness,
  verifyTokenForExpert,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
} = require("../utils/jwtHelper");
const jwtHelper = require("../utils/jwtHelper");
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

exports.authenticateAndAuthorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Lấy token từ header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "No token provided",
        });
      }

      const token = authHeader.split(" ")[1];
      // Verify token
      const decoded = jwtHelper.verifyAccessToken(token, process.env.ACCESS_TOKEN_SECRET);
      // Kiểm tra role nếu có
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(decoded.role)) {
          return res.status(403).json({
            success: false,
            message: "Không có quyền truy cập",
          });
        }
      }
      console.log(decoded)
      // Thêm thông tin user vào request
      req.payload = decoded;
      next();
    } catch (error) {
      console.error("Auth error:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token đã hết hạn",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ",
      });
    }
  };
};
