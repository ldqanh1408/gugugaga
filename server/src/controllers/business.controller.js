const mongoose = require("mongoose");
const Business = require("../models/business.model")
const Expert = require("../models/expert.model");
const bcrypt = require("bcryptjs"); // dùng để hash password

exports.addExpert = async (req, res) => {
    try {
      const { business_id } = req.business; // từ middleware/decoded token chẳng hạn
      let {
        account,
        password,
        name,
        gendar,
        number_of_treatment = 0,
        diploma_url,
        avatar_url,
      } = req.body;
  
      // Kiểm tra business_id có hợp lệ không
      if (!mongoose.Types.ObjectId.isValid(business_id)) {
        return res.status(400).json({ message: "business_id không hợp lệ" });
      }
  
      // Kiểm tra business có tồn tại không
      const business = await Business.findOne({_id: business_id});
      if (!business) {
        return res.status(404).json({ message: "Không tìm thấy business" });
      }
  
      // Kiểm tra account đã tồn tại chưa
      const existingExpert = await Expert.findOne({ account });
      if (existingExpert) {
        return res.status(409).json({ message: "Tài khoản đã tồn tại" });
      }
  
      // Băm password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Tạo Expert mới
      const newExpert = new Expert({
        account,
        password: hashedPassword,
        expertName: name,
        gendar,
        number_of_treatment,
        diploma_url,
        avatar_url,
        business_id: new mongoose.Types.ObjectId(business_id),
        role: "EXPERT", // hoặc để schema tự gán default
      });
  
      await newExpert.save();
  
      res.status(201).json({ success: true, expert: newExpert });
    } catch (error) {
      console.error("Lỗi tạo expert:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  };