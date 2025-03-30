const mongoose = require("mongoose");
const { GridFSBucket } = require('mongodb');
let gfs;

const connectDB = async () => {
  try {
    const conn  = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = conn.connection.db;
    gfs = new GridFSBucket(db, { bucketName: 'uploads' }); // GridFS bucket

    console.log("✅ Kết nối MongoDB thành công");
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB", error);
    process.exit(1);
  }
};

const getGFS = () => {
  if (!gfs) {
    throw new Error("❌ gfs chưa được khởi tạo. Hãy đảm bảo connectDB đã chạy!");
  }
  return gfs;
};


module.exports = { connectDB, getGFS };
