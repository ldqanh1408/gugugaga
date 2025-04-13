// helpers/redisHelper.js
const redisClient = require("../configs/redisClient");

require("dotenv").config();

const saveRefreshToken = async (userId, token) => {
  await redisClient.set(`refresh:${userId}`, token, {
    EX: process.env.REFRESH_TOKEN_EXPIRATION, // 7 ngày
  });
};

const isValidRefreshToken = async (userId, token) => {
  const storedToken = await redisClient.get(`refresh:${userId}`);
  return storedToken === token;
};

const blacklistToken = async (token, expiresInSeconds) => {
  await redisClient.set(`blacklist:${token}`, "true", {
    EX: expiresInSeconds,
  });
};

const isBlacklisted = async (token) => {
  const result = await redisClient.get(`blacklist:${token}`);
  return result === "true";
};

module.exports = {
  saveRefreshToken,
  isValidRefreshToken,
  blacklistToken,
  isBlacklisted,
};
