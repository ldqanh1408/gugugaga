const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id.toString(),
      userName: user.userName,
      chatId: user.chatId,
      journalId: user.journalId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createToken, verifyToken };
