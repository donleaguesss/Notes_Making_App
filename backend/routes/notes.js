import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

//Get Notes
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//create Note
router.post("/", protect, async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const note = await Note.create({
      title,
      description,
      createdBy: req.user._id,
    });
    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single note
router.get("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this note" });
    }
    res.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a note
router.put("/:id", protect, async (req, res) => {
  const { title, description } = req.body;
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this note" });
    }
    note.title = title || note.title;
    note.description = description || note.description;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Delete a note
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this note" });
    }
    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
