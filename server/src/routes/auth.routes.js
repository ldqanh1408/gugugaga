const express = require("express");
const bcrypt = require("bcryptjs");
const { createToken, verifyToken, createTokenForBusiness, createTokenForExpert } = require("../utils/jwtHelper");
const User = require("../models/user.model");
const Business = require("../models/business.model");
const Expert = require("../models/expert.model");
const Chat = require("../models/chat.model");
const Journal = require("../models/journal.model");
const router = express.Router();
const dotenv = require("dotenv");
const {
  validateRegister,
  validateLogin,
  authenticateJWT,
} = require("../middleware");
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
    var { account, password } = req.body;

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
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo user", error: error.message });
  }
});

router.post("/v1/logout", async (req, res) => {
  try {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(400).json({ success: false, messages: error.message });
  }
});

router.get("/v1/get-token", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(404)
        .json({ success: false, message: "Token not found", token: null });
    }
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
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

router.get("/v1/me", (req, res) => {
  const token = req.cookies.token; // Lấy token từ cookie
  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }
  try {
    const payload = verifyToken(token);
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
      const {
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
    } else if (role === "EXPERT") {
      let {
        account,
        password,
        expertName,
        gendar,
        role,
        number_of_treatment,
        diploma_url,
        business_id,
        avatar_url,
      } = req.body;

      password = await hashPassword(password);
      business_id = new mongoose.Types.ObjectId(business_id);

      const newExpert = new Expert({
        account,
        password,
        expertName,
        gendar,
        role,
        number_of_treatment,
        diploma_url,
        business_id,
        avatar_url,
      });

      await newExpert.save();
    }
    return res
      .status(200)
      .json({ success: true, message: "Register successfully" });
  } catch (error) {
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
    return res.status(500).json({ success: false, message: error.nessage });
  }
});
module.exports = router;
