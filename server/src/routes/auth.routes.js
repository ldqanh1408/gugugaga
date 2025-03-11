const express = require("express");
const bcrypt = require("bcryptjs");
const {createToken} = require("../utils/jwtHelper");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const Journal = require("../models/journal.model")
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

async function hashPassword(password) {
  const saltRounds = 10; // Số lần hash (càng cao càng an toàn nhưng chậm)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account
 *               - userName
 *               - password
 *             properties:
 *               account:
 *                 type: string
 *                 example: "newuser123"
 *               userName:
 *                 type: string
 *                 example: "New User"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */


// // 📝 Đăng ký
router.post("/register", async (req, res) => {
  try {
    
    var { account, userName, password } = req.body;
    password = await hashPassword(password);
    const chat = new Chat();
    const journal = new Journal();

    const newUser = new User({
        account,
        userName,
        password,
        chatId: chat._id,
        journalId: journal._id,
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

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - account
 *               - password
 *             properties:
 *               account:
 *                 type: string
 *                 example: "newuser123"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về token được lưu vào cookie  (có thể get bằng api)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đăng nhập thành công"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsIn..."
 *       400:
 *         description: Sai tài khoản hoặc mật khẩu
 *       500:
 *         description: Lỗi máy chủ
 */


// 🔐 Đăng nhập
router.post("/login", async (req, res) => {
  try {
      var { account , password } = req.body;
      password = await hashPassword(password);

     const user = await User.findOne({account});
     if(!user) return res.status(400).json("Người dùng không tồn tại");

      const isMatch = await bcrypt.compare(password, user.password);
      const token = createToken(user);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
      res.status(201).json({message: "Đăng nhập thành công"});
    } catch (error) {
      res.status(400).json({ message: "Lỗi khi tạo user", error: error.message });
    }
});

router.post("/logout", async (req, res) => {
    try{

      res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
      res.status(200).json({success: true, message: "Logged out" });
    }
    catch(error){
      res.status(400).json({success:false, messages: error.message});
    }

})

router.get("/get-token", async (req,res) => {
  try{
    const token = req.cookies.token;
    if(!token){
      return res.status(404).json({success: false, message: 'Token not found'});
    }
    return res.status(200).json({token});
  }
  catch(error){
    return res.status(404).json({success: false, message: error.message})
  }
})


module.exports = router;
