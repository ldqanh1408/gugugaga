const express = require("express");
const bcrypt = require("bcryptjs");
const {
  createToken,
  verifyToken,
  createTokenForBusiness,
  createTokenForExpert,
  createRefreshToken,
} = require("../utils/jwtHelper");
const User = require("../models/user.model");
const Business = require("../models/business.model");
const Expert = require("../models/expert.model");
const Chat = require("../models/chat.model");
const Journal = require("../models/journal.model");
const router = express.Router();
const dotenv = require("dotenv");
const ROLE_MODELS = require("../utils/roleHelper");
const jwt = require("../middleware/authenticateJWT");
const {
  validateRegister,
  validateLogin,
  authenticateJWT,
} = require("../middleware");

const jwtHelper = require("../utils/jwtHelper");
const mongoose = require("mongoose");
dotenv.config();

async function hashPassword(password) {
  const saltRounds = 10; // Số lần hash (càng cao càng an toàn nhưng chậm)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// // 📝 Đăng ký

router.post("/v1/register", validateRegister, async (req, res) => {
  try {
    var {
      account,
      userName,
      password,
      email = req.email || "",
      phone = req.phone || "",
      avatar = "",
      bio = "",
      dob = "",
      gender = "male",
    } = req.body;
    password = await hashPassword(password);
    const chat = new Chat();
    const journal = new Journal();

    const newUser = new User({
      account,
      userName,
      password,
      email,
      phone,
      chatId: chat._id,
      journalId: journal._id,
      avatar,
      bio,
      gender,
      dob,
    });
    chat.userId = newUser._id;
    journal.userId = newUser._id;

    await newUser.save();
    await chat.save();
    await journal.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// 🔐 Đăng nhập
router.post("/v1/login", validateLogin, async (req, res) => {
  try {
    const { account, password } = req.body;

    const user = await User.findOne({ account });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản không tồn tại",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu không chính xác",
      });
    }

    const token = createToken(user);

    // Tạo profile object để trả về cho client
    const profile = {
      id: user._id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
      futureMails: user.futureMails,
    };

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      token,
      profile,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập",
    });
  }
});

router.post("/v1/logout", async (req, res) => {
  try {
    res.cookie("accessToken", "", { httpOnly: true, expires: new Date(0) });
    res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(400).json({ success: false, messages: error.message });
  }
});

router.get("/v1/get-token", async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (!accessToken) {
    return res.status(404).json({
      success: false,
      message: "Access token not found",
      accessToken: null,
    });
  }
  let decoded;
  try {
    decoded = await jwtHelper.verifyAccessToken(accessToken);
    if (!decoded._id) throw new Error({ name: "TokenExpiredError" });
    return res.status(200).json({
      success: true,
      data: decoded,
      accessToken: accessToken,
    });
  } catch (error) {
    // Token hết hạn → xử lý làm mới bằng refresh token
    if (!refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Refresh token not found" });
    }
    try {
      const decodedRefresh = jwtHelper.verifyRefreshToken(refreshToken);

      // Tạo lại access token mới
      const newAccessToken = jwtHelper.createAccessToken(decodedRefresh);
      // Gửi lại access token mới qua cookie hoặc body
      return res
        .status(200)
        .json({ success: true, accessToken: newAccessToken });
    } catch (refreshErr) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }
  }
});

router.get("/v1/check-auth", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "Chưa đăng nhập" });
  }

  try {
    const payload = verifyToken(token);
    res.status(200).json({ isAuthenticated: true, user: payload });
  } catch (error) {
    res
      .status(401)
      .json({ isAuthenticated: false, message: "Token không hợp lệ" });
  }
});

router.get("/v1/me", jwt.authenticateAndAuthorize(["USER"]), (req, res) => {
  const token = req.cookies.accessToken; // Lấy token từ cookie
  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  try {
    const payload = jwtHelper.verifyAccessToken(token);
    res.json({
      userId: payload._id,
      journalId: payload.journalId,
      chatId: payload.chatId,
      userName: payload.userName,
    });
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
});

router.post("/v1/change-password", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  try {
    const payload = verifyToken(token);
    const { newPassword, currentPassword } = req.body;
    if (!newPassword || !currentPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu thông tin" });
    }
    const userId = payload._id;
    var user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy user" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch)
      return res
        .status(404)
        .json({ success: false, message: "Mật khẩu không khớp" });

    user.password = await hashPassword(newPassword);
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

router.post("/v2/register", async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: "Please provide role" });
    }
    if (role === "USER") {
      let {
        account,
        userName,
        password,
        email = req.email || "",
        phone = req.phone || "",
        avatar = "",
        bio = "",
        dob = "",
        gender = "male",
      } = req.body;
      password = await hashPassword(password);
      const chat = new Chat();
      const journal = new Journal();

      const newUser = new User({
        account,
        userName,
        password,
        email,
        phone,
        chatId: chat._id,
        journalId: journal._id,
        avatar,
        bio,
        gender,
        dob,
        role,
      });
      chat.userId = newUser._id;
      journal.userId = newUser._id;

      await newUser.save();
      await chat.save();
      await journal.save();
    } else if (role === "BUSINESS") {
      let { account, password, business_name, business_email, role } = req.body;

      password = await hashPassword(password);

      const newBusiness = new Business({
        account,
        password,
        business_name,
        business_email,
        role,
      });

      await newBusiness.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Register successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/v2/login", async (req, res) => {
  const { account, password, role } = req.body;
  try {
    if (role === "USER") {
      const user = await User.findOne({ account });
      if (!user) return res.status(400).json("Người dùng không tồn tại");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json("Mật khẩu không hợp lệ");
      const token = createToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      res.status(201).json({ message: "Đăng nhập thành công" });
    } else if (role === "BUSINESS") {
      const business = await Business.findOne({ account });
      if (!business) return res.status(400).json("Người dùng không tồn tại");

      const isMatch = await bcrypt.compare(password, business.password);
      if (!isMatch) return res.status(400).json("Mật khẩu không hợp lệ");
      const token = createTokenForBusiness(business);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      res.status(201).json({ message: "Đăng nhập thành công" });
    } else if (role === "EXPERT") {
      const expert = await Expert.findOne({ account });
      if (!expert) return res.status(400).json("Người dùng không tồn tại");

      const isMatch = await bcrypt.compare(password, expert.password);
      if (!isMatch) return res.status(400).json("Mật khẩu không hợp lệ");
      const token = createTokenForExpert(expert);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      });
      res.status(201).json({ message: "Đăng nhập thành công" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/v3/login", async (req, res) => {
  const { account, password, role } = req.body;
  try {
    if (!ROLE_MODELS[role]) {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    const { model } = ROLE_MODELS[role];

    const roleModel = await model.findOne({ account });
    if (!roleModel)
      return res.status(400).json({ message: "Người dùng không tồn tại" });

    const isMatch = await bcrypt.compare(password, roleModel.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không hợp lệ" });

    const accessToken = jwtHelper.createAccessToken(roleModel);
    const refreshToken = jwtHelper.createRefreshToken(roleModel);
    console.log("Loggin accessTOken", accessToken);
    res.clearCookie("refreshToken");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.clearCookie("accessToken");
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    console.log(accessToken);

    res.status(201).json({ success: true, accessToken, data: roleModel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post(
  "/v1/refresh-token",
  jwt.authenticateAndAuthorize(["USER", "BUSINESS", "EXPERT"]),
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Lấy refresh token từ cookie

    // Kiểm tra xem refresh token có tồn tại không
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Kiểm tra xem refresh token có bị blacklist không
  

    try {
      // Xác minh refresh token
      const decoded = await jwtHelper.verifyRefreshToken(refreshToken);

      // Tạo Access Token mới
      const newAccessToken = jwtHelper.createAccessToken(decoded.user);

      // Tạo lại Refresh Token mới nếu cần (tùy thuộc vào yêu cầu bảo mật của bạn)
      const newRefreshToken = jwtHelper.createRefreshToken(decoded.user);

      // Lưu refresh token mới vào Redis hoặc cơ sở dữ liệu nếu cần

      // Gửi lại Access Token và Refresh Token mới trong cookie
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: true,
      });
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
      });

      return res.status(200).json({ message: "Tokens refreshed successfully" });
    } catch (error) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  }
);

router.get(
  "/v2/logout",
  jwt.authenticateAndAuthorize(["USER", "BUSINESS", "EXPERT"]),
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Lấy refresh token từ cookie

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    // Đưa refresh token vào blacklist trong Redis
    try {
      // Kiểm tra xem refresh token có hợp lệ không trước khi đưa vào blacklist
      const decoded = await jwtHelper.verifyRefreshToken(refreshToken); // Giả sử verifyRefreshToken sẽ trả về thông tin người dùng nếu token hợp lệ
      const expiresInSeconds = decoded.exp - Math.floor(Date.now() / 1000);
      // Lưu token vào blacklist (thời gian hết hạn giống với thời gian hết hạn của refresh token)

      // Xóa refresh token khỏi cookie
      res.clearCookie("refreshToken", { httpOnly: true, secure: true }); // Xóa cookie refresh token

      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error during logout", error: error.message });
    }
  }
);
module.exports = router;
