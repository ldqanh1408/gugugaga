const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const Journal = require("../models/journal.model");
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10; // Số lần hash (càng cao càng an toàn nhưng chậm)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Lấy danh sách users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo user mới
exports.createUser = async (req, res) => {
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
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo user", error: error.message });
  }
};

exports.login = (req, res) => {};
