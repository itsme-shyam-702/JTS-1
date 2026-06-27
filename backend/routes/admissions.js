import express from "express";
import Admission from "../models/Admission.js";

const router = express.Router();

// POST - Submit admission (no auth required)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, course, message, selectedClass, dob, parentName, contact, address } = req.body;

    if (!name || !name.toString().trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newAdmission = await Admission.create({
      name,
      email: email || "",
      phone: phone || "",
      course: course || selectedClass || "",
      selectedClass: selectedClass || course || "",
      dob: dob || "",
      parentName: parentName || "",
      contact: contact || phone || "",
      address: address || "",
      message: message || "",
    });

    res.status(201).json({ message: "Admission submitted successfully!", data: newAdmission });
  } catch (err) {
    console.error("Error submitting admission:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - All admissions (no auth required)
router.get("/", async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE - Remove admission (no auth required)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Admission.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Admission deleted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
