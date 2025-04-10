const {authenticateJWT, authenticateBusinessJWT} = require("./authenticateJWT");
const {
  validateUser,
  validateLogin,
  validateMessage,
  validateNote,
  validateRegister,
} = require("./validationMiddleware");
module.exports = {
  authenticateJWT,
  validateRegister,
  validateLogin,
  validateMessage,
  validateNote,
  authenticateBusinessJWT
};
