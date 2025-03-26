const express = require("express");
const router = express.Router();
const { getUsers, deleteUser, getUser } = require("../controllers/user.controller");

// Định nghĩa route
router.get("/", getUsers);
router.delete("/:userId", deleteUser);
router.get("/:userId", getUser);

module.exports = router;
