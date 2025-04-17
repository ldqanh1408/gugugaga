const { Worker } = require('bullmq');
const connection = require('../configs/redisQueueConnection');
const Chat = require('../models/chat.model');

// Worker xử lý job từ queue 'chatQueue'
const worker = new Worker(
  'chatQueue',
  async (job) => {
    const { chatId, message } = job.data;

    switch (job.name) {
      case 'add-message':
        // Tìm chat trong database
        const chat = await Chat.findById(chatId);
        if (!chat) {
          throw new Error('Không tìm thấy chat với ID đã cung cấp');
        }

        // Thêm message vào mảng messages
        chat.messages.push(message);
        await chat.save();

        console.log(`✅ Tin nhắn được thêm vào chat ${chatId}`);
        break;

      default:
        console.warn(`⚠️ Không có handler cho job tên "${job.name}"`);
    }
  },
  {
    connection,
  }
);

// Log trạng thái kết nối
worker.on('ready', () => {
  console.log('🚀 Worker đã kết nối thành công và sẵn sàng xử lý job');
});

worker.on('completed', (job) => {
  console.log(`🎉 Job "${job.name}" (${job.id}) đã hoàn thành`);
});

worker.on('failed', (job, err) => {
  console.error(`💥 Job "${job.name}" (${job.id}) thất bại: ${err.message}`);
});
c