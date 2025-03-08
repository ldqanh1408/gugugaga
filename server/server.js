require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/db");

// Kết nối MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
const {userRoutes, chatRoutes, journalRoutes} = require('./src/routes');
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/journals", journalRoutes);

// Middleware xử lý lỗi
app.use(require("./src/middleware/errorHandler"));

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));
