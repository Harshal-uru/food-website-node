require("dotenv").config(); // <-- load .env first!

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Allow all origins (you can restrict later if needed)
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// API routes (already prefixed with /api)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/food-donations", require("./routes/foodDonationRoutes"));
app.use("/api/ngos", require("./routes/ngoRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// ✅ Serve React build in production
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "client", "build");
  app.use(express.static(buildPath));

  // Catch-all: send index.html for any non-API routes
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(buildPath, "index.html"));
    } else {
      res.status(404).json({ message: "API route not found" });
    }
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
