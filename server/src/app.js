const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const {
  userRoutes,
  chatRoutes,
  journalRoutes,
  authRoutes,
  businessRoutes,
  expertRoutes,
  scheduleRoutes,
  treatmentRoutes,
  bookingRoutes,
  uploadRoutes,
} = require("./routes");

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api", userRoutes);
app.use("/api", chatRoutes);
app.use("/api", journalRoutes);
app.use("/api", authRoutes);
app.use("/api", businessRoutes);
app.use("/api", expertRoutes);
app.use("/api", scheduleRoutes);
app.use("/api", treatmentRoutes);
app.use("/api", bookingRoutes);
app.use("/api", uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
});

module.exports = app;
