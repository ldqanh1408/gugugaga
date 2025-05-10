const jwt = require("jsonwebtoken");

exports.authToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }

    console.log("Token received in Authorization header:", token);
    console.log("JWT_SECRET used for verification:", process.env.JWT_SECRET);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.payload = decoded;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
