const express = require("express");
const router = express.Router();
const { getUsers, deleteUser } = require("../controllers/user.controller");

// Định nghĩa route
router.get("/", getUsers);
router.delete("/:userId", deleteUser);

module.exports = router;
