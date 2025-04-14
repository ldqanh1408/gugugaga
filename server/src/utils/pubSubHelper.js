const redis = require("../configs/redisClient");
const constants = require("../constants");
const redisHelper = require("../utils/redisHelper")
// Tạo 2 client: 1 để publish, 1 để subscribe
const subscriber = redis.duplicate();
const publisher = redis.duplicate();

subscriber.connect();
publisher.connect();
const chanelExperts = constants.CHANEL_EXPERTS;
// Hàm publish
const publishInvalidation = async (channel, message) => {
  await publisher.publish(channel, JSON.stringify(message));
};

// Hàm subscribe (truyền callback xử lý)
const subscribeInvalidation = async (channel, callback) => {
  await subscriber.subscribe(channel, (msg) => {
    try {
      const data = JSON.parse(msg);
      callback(data);
    } catch (err) {
      console.error("PubSub parse error:", err.message);
    }
  });
};

const startPubSub = async () => {
  subscribeInvalidation(chanelExperts, async ({ businessId }) => {
    const key = `experts:business:${businessId}`;
    console.log("💥 Invalidate cache for:", key);
    await redis.del(key)// Xoá cache khi có cập nhật dữ liệu
  });
};

module.exports = {
  publishInvalidation,
  subscribeInvalidation,
  startPubSub
};
