const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Vai trò của tin nhắn là bắt buộc"],
      enum: {
        values: ["user", "ai"],
        message: "{VALUE} không phải là vai trò hợp lệ",
      },
      trim: true,
    },
    text: {
      type: String,
      trim: true, // Loại bỏ khoảng trắng thừa
      minlength: [1, "Nội dung tin nhắn không được để trống"],
      maxlength: [2000, "Nội dung tin nhắn không được vượt quá 2000 ký tự"],
    },
    imgUrl: {
      type: String,
      trim: true,
    },
    media: [{
      type: {
        type: String,
        enum: ["image", "audio"],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    }]
  },
  {
    timestamps: true,
  }
);

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ID người dùng là bắt buộc"],
    },
    messages: {
      type: [messageSchema],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 1000;
        },
        message: "Số lượng tin nhắn không được vượt quá 1000",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
