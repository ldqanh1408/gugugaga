const redis = require("../configs/redisClient");
const constants = require("../constants");
const redisHelper = require("../utils/redisHelper");
// Tạo 2 client: 1 để publish, 1 để subscribe
const subscriber = redis.duplicate();
const publisher = redis.duplicate();

subscriber.connect();
publisher.connect();
const chanelExperts = constants.CHANEL_EXPERTS;
const channelUsers = constants.CHANEL_USERS;
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


const startPubSub = async (subscriptions) => {
  for(let {chanel, keyBuilder} of subscriptions){
    await(subscribeInvalidation(chanel, async(payload) => {
      const keys = keyBuilder(payload);
      for (const key of keys) {
        const exist = await redis.del(key);
      }
    }))
    console.log(`kết nối chanel: ${chanel} thành công`)
  }
};
module.exports = {
  publishInvalidation,
  subscribeInvalidation,
  startPubSub,
};
