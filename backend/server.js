import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

import eventRoutes from "./routes/eventRoutes.js";
import galleryRoutes from "./routes/gallery.js";
import admissionRoutes from "./routes/admissions.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS — allow frontend origin from .env
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,   // add FRONTEND_URL=https://your-app.vercel.app in backend .env
].filter(Boolean);

app.use(cors({
  origin: "*",
  credentials: false,
}));

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/admission", admissionRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/build");
  app.use(express.static(frontendPath));
  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
} else {
  app.get("/", (_, res) => res.send("Server running in development mode"));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));