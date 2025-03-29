const { body, param, validationResult } = require("express-validator");

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

const validateRegister = validate([
  body("account").notEmpty().withMessage("Account is required."),
  body("userName").notEmpty().withMessage("Username is required."),
  body("password").notEmpty().withMessage("Password is required."),

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

  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number.")
    .custom(async (phoneNumber) => {
      if (phoneNumber) {
        const existingUser = await User.findOne({ phoneNumber });
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
    .notEmpty().withMessage("Cảm xúc không được để trống")
    .isIn(["happy", "sad", "neutral", "excited", "angry"]).withMessage("Cảm xúc không hợp lệ"),

  body("header")
    .notEmpty().withMessage("Tiêu đề không được để trống")
    .isLength({ max: 100 }).withMessage("Tiêu đề tối đa 100 ký tự")
    .trim()
    .escape(), // Ngăn XSS

  body("text")
    .notEmpty().withMessage("Nội dung không được để trống")
    .trim()
    .escape(), // Ngăn XSS
]);



module.exports = { validateRegister, validateLogin, validateMessage, validateNote };
