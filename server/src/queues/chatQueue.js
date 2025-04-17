const { Queue } = require('bullmq');
const connection = require('../configs/redisQueueConnection');

// Khởi tạo queue chatQueue
const chatQueue = new Queue('chatQueue', {
  connection,
});

module.exports = chatQueue;