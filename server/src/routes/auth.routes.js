const express = require("express");
const bcrypt = require("bcryptjs");
const { createToken, verifyToken } = require("../utils/jwtHelper");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const Journal = require("../models/journal.model");
const router = express.Router();
const dotenv = require("dotenv");
const { validateUser, validateLogin, authenticateJWT } = require("../middleware")
dotenv.config();

async function hashPassword(password) {
  const saltRounds = 10; // Số lần hash (càng cao càng an toàn nhưng chậm)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// // 📝 Đăng ký
router.post("/register", validateUser , async (req, res) => {
  try {
    var { account, userName, password, email = "", phoneNumber = "", avatar = ""} = req.body;
    password = await hashPassword(password);
    const chat = new Chat();
    const journal = new Journal();

    const newUser = new User({
      account,
      userName,
      password,
      email,
      phoneNumber,
      chatId: chat._id,
      journalId: journal._id,
      avatar,
    });
    chat.userId = newUser._id;
    journal.userId = newUser._id;

    await newUser.save();
    await chat.save();
    await journal.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔐 Đăng nhập
router.post("/login", validateLogin, async (req, res) => {
  try {
    var { account, password } = req.body;

    const user = await User.findOne({ account });
    if (!user) return res.status(400).json("Người dùng không tồn tại");

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json("Mật khẩu không hợp lệ");
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

router.post("/logout", async (req, res) => {
  try {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    res.status(400).json({ success: false, messages: error.message });
  }
});

router.get("/get-token", async (req, res) => {
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

router.get('/check-auth', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ isAuthenticated: false, message: 'Chưa đăng nhập' });
  }

  try {
    const payload = verifyToken(token);
    res.json({ isAuthenticated: true, user: payload});
  } catch (error) {
    res.status(401).json({ isAuthenticated: false, message: 'Token không hợp lệ' });
  }
});

router.get('/me', (req, res) => {
  const token = req.cookies.token; // Lấy token từ cookie
  if (!token) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }
  try {
    const payload = verifyToken(token);
    res.json({
      userId: payload._id,
      journalId: payload.journalId,
      chatId: payload.chatId,
      userName: payload.userName

    });
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
});

router.post('/change-password',async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Chưa đăng nhập' });
  }
  try {
    const payload = verifyToken(token);
    const {newPassword, currentPassword} = req.body
    if(!newPassword || !currentPassword){
      return res.status(400).json({success: false, message: "Thiếu thông tin"});
    }
    const userId = payload._id;
    var user = await User.findOne({_id: userId});
    if(!user){
      return res.status(400).json({success: false, message: "Không tìm thấy user"});
    }
    
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if(!isMatch) return res.status(404).json({success:false, message: "Mật khẩu không khớp"})
      
      user.password = await hashPassword(newPassword);
      await user.save();

      return res.status(200).json({success: true, message: "Đổi mật khẩu thành công"});

  } catch (error) {
    return res.status(401).json({message: error.message });
  }
})

module.exports = router;

