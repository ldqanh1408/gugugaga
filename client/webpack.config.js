const path = require('path');

module.exports = {
  // ... các cấu hình khác ...
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@services': path.resolve(__dirname, 'src/services/'),
      '@pages': path.resolve(__dirname, 'src/Pages/'),
      '@constants': path.resolve(__dirname, 'src/constants/'),
      // Thêm các alias khác nếu cần
    },
  },
};