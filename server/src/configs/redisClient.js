// redisClient.js
const {createClient} = require("redis")

const client = createClient();

client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

client.on('connect', () => {
  console.log('🔄 Redis connecting...');
});

client.on('ready', () => {
  console.log('✅ Redis connected and ready!');
});

client.on('end', () => {
  console.log('🔌 Redis connection closed.');
});

const ensureRedisConnected = async () => {
  if (!client.isOpen) {
    await client.connect();  // Kết nối lại nếu client đã bị đóng
  }
};

const runRedisOperations = async () => {
  try {
    await ensureRedisConnected(); // Đảm bảo client đã kết nối

    // Tiến hành thao tác Redis
  } catch (error) {
    console.error("Redis operation failed:", error);
  }
};

// Khởi chạy
runRedisOperations();

module.exports = client;
