import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
// Correct path for .env when running from backend/
dotenv.config({ path: ".env" });

import userRoutes from "./interfaces/http/routes/user.routes";
import authRoutes from "./interfaces/http/routes/auth.routes";
import profileRoutes from "./interfaces/http/routes/profile.routes";
import jobRoutes from "./interfaces/http/routes/job.routes";
import proposalRoutes from "./interfaces/http/routes/proposal.routes";
import cors from "cors";

const app = express();
const PORT = process.env["PORT"] || 5000;
const DB_URI = process.env["DB_URI"] || "";

// Simple CORS setup
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// User CRUD routes
app.use("/api/users", userRoutes);
// Auth routes
app.use("/api/auth", authRoutes);
// Profile routes
app.use("/api/profile", profileRoutes);
// Job routes
app.use("/api", jobRoutes);
// Proposal routes
app.use("/api", proposalRoutes);

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
      console.log("");
      console.log("Job endpoints:");
      console.log(`  Get all jobs:   GET    http://localhost:${PORT}/api/jobs`);
      console.log(`  Create job:     POST   http://localhost:${PORT}/api/jobs`);
      console.log(
        `  Get job by id:  GET    http://localhost:${PORT}/api/jobs/:id`
      );
      console.log(
        `  Get by category: GET   http://localhost:${PORT}/api/jobs/category/:category`
      );
      console.log("");
      console.log("Proposal endpoints:");
      console.log(
        `  Create proposal: POST  http://localhost:${PORT}/api/proposals`
      );
      console.log(
        `  Get proposals:   GET   http://localhost:${PORT}/api/proposals/job/:jobId`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
