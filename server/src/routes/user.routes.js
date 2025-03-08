const express = require("express");
const router = express.Router();
const { getUsers, createUser } = require("../controllers/user.controller");

// Định nghĩa route
router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;