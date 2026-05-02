import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔓 Public Routes (no token needed)
app.use("/api/auth", authRoutes);

// 🔒 Protected Routes (token required)
app.use("/api/notes", protect, noteRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});