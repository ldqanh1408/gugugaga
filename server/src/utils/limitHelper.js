const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request mỗi IP trong 15 phút
  message: "Bạn đã gửi quá nhiều yêu cầu, hãy thử lại sau.",
  headers: true, // Trả về thông tin giới hạn trong header
});

module.exports = limiter