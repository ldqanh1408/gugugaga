require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { connectDB } = require("./src/configs/db");
const cookieParser = require("cookie-parser");
const limiter = require("./src/utils/limitHelper");

const {swaggerSpec, swaggerUi} = require("./src/configs/swagger")
// const authRoutes = require("./routes/auth"); // Import routes

// Kết nối MongoDB
connectDB();

const app = express();

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Đặt đúng origin frontend
  res.header("Access-Control-Allow-Credentials", "true"); // Gửi credentials
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json({ limit: "10mb" })); // Tăng giới hạn JSON payload
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Tăng giới hạn cho form data

app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Cho phép frontend cụ thể truy cập
    credentials: true, // Cho phép gửi cookie, token, thông tin xác thực
    methods: ["GET", "POST", "PATCH", "DELETE"], // Các phương thức HTTP được phép
    allowedHeaders: ["Content-Type", "Authorization"], // Header được phép
  })
);
// app.use(limiter);

// Định tuyến tài liệu API Swagger

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const {
  userRoutes,
  chatRoutes,
  journalRoutes,
  authRoutes,
  backupRoutes,
  expertRoutes,
  businessRoutes,
  treatmentRoutes,
  bookingRoutes,
  uploadRoutes,
  emotionRoutes // mount emotionRoutes
} = require("./src/routes");

app.use("/api", userRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/journals", journalRoutes);
app.use("/api/v1/backup", backupRoutes);
app.use("/api", authRoutes);
app.use("/api", expertRoutes);
app.use("/api", businessRoutes);
app.use("/api", treatmentRoutes);
app.use("/api", bookingRoutes);
app.use("/api", uploadRoutes);
app.use("/api/emotions", emotionRoutes); // mount đúng endpoint
// Middleware xử lý lỗi
app.use(require("./src/middleware/errorHandler"));
// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy trên cổng ${PORT}`));
