const cloudinary = require("cloudinary").v2;
require("dotenv").config();
// Cấu hình Cloudinary với thông tin từ Dashboard
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,    // Thay thế bằng cloud_name của bạn
  api_key: process.env.API_KEY,          // Thay thế bằng API key
  api_secret: process.env.API_SECRET_KEY,    // Thay thế bằng API secret
});

module.exports = cloudinary;