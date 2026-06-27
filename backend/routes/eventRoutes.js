import express from "express";
import multer from "multer";
import Event from "../models/Event.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET all active events (public)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find({ deleted: false }).sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET deleted events
router.get("/deleted", async (req, res) => {
  try {
    const events = await Event.find({ deleted: true });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST add new event
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : "";
    const fileType = req.file ? req.file.mimetype.split("/")[0] : "";
    const event = await Event.create({ title, description, date, filePath, fileType });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH soft delete
router.patch("/delete/:id", async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, { deleted: true });
    res.json({ message: "Event soft deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH restore
router.patch("/restore/:id", async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, { deleted: false });
    res.json({ message: "Event restored" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE permanent
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
