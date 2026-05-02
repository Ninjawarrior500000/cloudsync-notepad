import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

// ➕ Create Note
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    const newNote = new Note({
      title,
      content,
      userId: req.user.id, // 🔒 link note to logged in user
    });
    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📥 Get All Notes (only for logged in user)
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }) // 🔒 only this user's notes
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✏️ Update Note
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id, // 🔒 only update if note belongs to user
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found!" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { returnDocument: "after" }
    );

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ❌ Delete Note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id, // 🔒 only delete if note belongs to user
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found!" });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;