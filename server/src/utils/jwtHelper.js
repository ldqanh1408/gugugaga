const jwt = require("jsonwebtoken");

require("dotenv").config();

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

const createTokenForBusiness = (business) => {
  return jwt.sign(
    {
      _id: business._id.toString(),
    },
    process.env.JWT_SECRET_BUSINESS,
    { expiresIn: "1d" }
  );
};

const createTokenForExpert = (expert) => {
  return jwt.sign(
    {
      _id: expert._id.toString(),
    },
    process.env.JWT_SECRET_EXPERT,
    { expiresIn: "1d" }
  );
};

const verifyTokenForExpert = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_EXPERT);
};

const verifyTokenForBusiness = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_BUSINESS);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  createToken,
  verifyToken,
  createTokenForBusiness,
  verifyTokenForBusiness,
  createTokenForExpert,
  verifyTokenForExpert,
};
