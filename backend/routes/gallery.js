import express from "express";
import multer from "multer";
import Gallery from "../models/Gallery.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET all active images (public)
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find({ deleted: false }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET deleted images
router.get("/deleted", async (req, res) => {
  try {
    const deleted = await Gallery.find({ deleted: true });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST upload new image
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : "";
    const fileType = req.file ? req.file.mimetype.split("/")[0] : "";
    const image = await Gallery.create({ title, description, filePath, fileType });
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH soft delete
router.patch("/delete/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndUpdate(req.params.id, { deleted: true });
    res.json({ message: "Image soft deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH restore
router.patch("/restore/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndUpdate(req.params.id, { deleted: false });
    res.json({ message: "Image restored" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE permanent
router.delete("/:id", async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Image permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
