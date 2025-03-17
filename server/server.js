require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/configs/db");
const cookieParser = require("cookie-parser");
const { swaggerUi, swaggerSpec } = require("./src/configs/swagger");
const limiter = require("./src/utils/limitHelper")
// const authRoutes = require("./routes/auth"); // Import routes

// Kết nối MongoDB
connectDB();

const app = express();


// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // Cho phép frontend truy cập

app.use(limiter);

// Định tuyến tài liệu API Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const {
  userRoutes,
  chatRoutes,
  journalRoutes,
  authRoutes,
  backupRoutes,
} = require("./src/routes");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/journals", journalRoutes);
app.use("/api/v1/backup", backupRoutes);
app.use("/api/v1", authRoutes);

// Middleware xử lý lỗi
app.use(require("./src/middleware/errorHandler"));

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));

