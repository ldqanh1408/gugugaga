const crypto = require('crypto');

// Sinh secret key dài 64 ký tự hexa
const secretKey = crypto.randomBytes(32).toString('hex');
console.log('Secret Key:', secretKey);