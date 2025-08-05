import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
// Correct path for .env when running from backend/
dotenv.config({ path: ".env" });

import userRoutes from "./interfaces/http/routes/user.routes";
import authRoutes from "./interfaces/http/routes/auth.routes";

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI || "";

app.use(express.json());

// User CRUD routes
app.use("/api/users", userRoutes);
// Auth routes
app.use("/api/auth", authRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Available endpoints:");
      console.log(`  Health check:   http://localhost:${PORT}/api/health`);
      console.log(
        `  Create user:    POST   http://localhost:${PORT}/api/users`
      );
      console.log(
        `  Get all users:  GET    http://localhost:${PORT}/api/users`
      );
      console.log(
        `  Get user by id: GET    http://localhost:${PORT}/api/users/:id`
      );
      console.log(
        `  Update user:    PUT    http://localhost:${PORT}/api/users/:id`
      );
      console.log(
        `  Delete user:    DELETE http://localhost:${PORT}/api/users/:id`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
