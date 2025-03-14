const authenticateJWT = require("./authenticateJWT");
const {
  validateUser,
  validateLogin,
  validateMessage,
  validateNote,
} = require("./validationMiddleware");
module.exports = {
  authenticateJWT,
  validateUser,
  validateLogin,
  validateMessage,
  validateNote
};
