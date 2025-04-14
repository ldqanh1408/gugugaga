// helpers/redisHelper.js
const redisClient = require("../configs/redisClient");

require("dotenv").config();

const saveRefreshToken = async (_id, token) => {
  await redisClient.set(`refresh:${_id}`, token, {
    EX: process.env.REFRESH_TOKEN_EXPIRATION, // 7 ngày
  });
};

const saveAccessToken = async (_id, token) => {
    await redisClient.set(`access:${_id}`, token, {
      EX: process.env.ACCESS_TOKEN_EXPIRATION, 
    });
  };

const isValidRefreshToken = async (_id, token) => {
  const storedToken = await redisClient.get(`refresh:${_id}`);
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

const set = async (key, value, expiresInSeconds = 3600) => {
  await redisClient.set(key, JSON.stringify(value), { EX: expiresInSeconds });
}

const get = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};


const del = async (key) => {
  await redisClient.del(key);
};

 // Kiểm tra tồn tại
const exists = async (key) => {
  const exists = await redisClient.exists(key);
  return exists === 1;
};

module.exports = {
  saveRefreshToken,
  isValidRefreshToken,
  blacklistToken,
  saveAccessToken,
  isBlacklisted,
  set,
  get,
  del,
  exists
};
