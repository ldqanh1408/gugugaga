const express = require('express');
const router = express.Router();
const { upload, uploadMedia } = require('../controllers/upload.controller');

router.post('/media', upload.single('file'), uploadMedia);

module.exports = router;