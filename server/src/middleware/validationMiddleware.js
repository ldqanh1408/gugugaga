const { body, param, validationResult } = require("express-validator");
const User = require("../models/user.model");
// Middleware kiểm tra lỗi
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    next(); // Chuyển tiếp nếu không có lỗi
  };
};

const uniqueCheck = (field, message) => {
  return body(field).custom(async (value) => {
    const existingUser = await User.findOne({ [field]: value });
    if (existingUser) throw new Error(message);
  });
};

const validateRegister = validate([
  body("account")
    .notEmpty()
    .withMessage("Account is required.")
    .isLength({ min: 5, max: 20 })
    .withMessage("Account phải từ 5 đến 20 ký tự.")
    .matches(/^[a-zA-Z0-9._]+$/)
    .withMessage("Account chỉ được chứa chữ cái, số, dấu chấm và gạch dưới."),
  uniqueCheck("account", "Account already exists."),
  body("userName")
    .notEmpty()
    .withMessage("Nickname is required.")
    .isLength({ min: 3, max: 30 })
    .withMessage("Nickname phải từ 3 đến 30 ký tự.")
    .matches(/^[a-zA-Z0-9 ._-]+$/)
    .withMessage(
      "Nickname chỉ được chứa chữ cái, số, khoảng trắng, dấu gạch dưới (_), gạch ngang (-), và dấu chấm."
    ),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8, max: 32 })
    .withMessage("Password phải từ 8 đến 32 ký tự.")
    .matches(/[a-z]/)
    .withMessage("Password phải chứa ít nhất một chữ thường.")
    .matches(/[A-Z]/)
    .withMessage("Password phải chứa ít nhất một chữ hoa.")
    .matches(/\d/)
    .withMessage("Password phải chứa ít nhất một số.")
    .matches(/[@$!%*?&#]/)
    .withMessage(
      "Password phải chứa ít nhất một ký tự đặc biệt (@, $, !, %, *, ?, &, #)."
    )
    .not()
    .matches(/\s/)
    .withMessage("Password không được chứa khoảng trắng."),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (email) => {
      if (email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("Email already exists.");
        }
      }
    }),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number.")
    .custom(async (phone) => {
      if (phone) {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
          throw new Error("Phone number already exists.");
        }
      }
    }),
]);

const validateLogin = validate([
  body("account").notEmpty().withMessage("Tài khoản không được để trống"),
  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
]);

const validateMessage = validate([
  body("role").notEmpty().withMessage("Người gửi không được để trống"),
  body("text")
    .notEmpty()
    .withMessage("Nội dung tin nhắn không được để trống")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Nội dung phải từ 1 - 2000 ký tự")
    .escape(),
]);

const validateNote = validate([
  body("mood")
    .notEmpty()
    .withMessage("Cảm xúc không được để trống")
    .isIn(["happy", "sad", "neutral", "excited", "angry"])
    .withMessage("Cảm xúc không hợp lệ"),

  body("header")
    .notEmpty()
    .withMessage("Tiêu đề không được để trống")
    .isLength({ max: 100 })
    .withMessage("Tiêu đề tối đa 100 ký tự")
    .trim()
    .escape(), // Ngăn XSS

  body("text")
    .notEmpty()
    .withMessage("Nội dung không được để trống")
    .trim()
    .escape(), // Ngăn XSS
]);

module.exports = {
  validateRegister,
  validateLogin,
  validateMessage,
  validateNote,
};
