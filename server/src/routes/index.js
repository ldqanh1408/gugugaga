const userRoutes = require("./user.routes");
const chatRoutes = require("./chat.routes");
const journalRoutes = require("./journal.routes");
const authRoutes = require("./auth.routes");
const backupRoutes = require("./backup.routes");
const treatmentRoutes = require("./treatment.route");
const businessRoutes = require("./business.route");
const scheduleRoutes = require("./schedule.route");
const expertRoutes = require("./expert.route");
const bookingRoutes = require("./booking.routes")
const uploadRoutes = require("./upload.routes")
const emotionRoutes = require("./emotion.routes")
module.exports = {
  userRoutes,
  chatRoutes,
  journalRoutes,
  authRoutes,
  backupRoutes,
  businessRoutes,
  expertRoutes,
  scheduleRoutes,
  treatmentRoutes,
  bookingRoutes,
  uploadRoutes,
  emotionRoutes
};
