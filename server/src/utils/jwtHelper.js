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

const createAccessToken = (payload) => {
  console.log("payload", payload);  
  console.log("role", payload.role);  
  return jwt.sign(
    {
      _id: payload._id.toString(),
      role: payload.role,
      journalId: payload.journalId,
      chatId: payload.chatId
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION)  }
  );
};

const verifyAccessToken = (token) => {
  try{
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("payload return", payload);
    return payload;
  }
  catch(error){
    return error
  }
};


const createRefreshToken = (payload) => {
  return jwt.sign(
    {
      _id: payload._id.toString(),
      role: payload.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRATION) }
  );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = {
  createToken,
  verifyToken,
  createTokenForBusiness,
  verifyTokenForBusiness,
  createTokenForExpert,
  verifyTokenForExpert,
  createAccessToken,
  verifyAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  verifyAccessToken
};
