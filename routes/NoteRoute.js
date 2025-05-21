import express from "express";
import {
  getNotes,
  getNotesbyId,
  createNotes,
  updateNote,
  deleteNote,
} from "../controllers/NoteController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/notes",verifyToken,   getNotes);
router.get("/notes-auth",verifyToken, getNotes);
router.get("/notes/:id", verifyToken,getNotesbyId);
router.post("/notes", verifyToken, createNotes);
router.put("/notes/:id",verifyToken, updateNote);
router.delete("/notes/:id",verifyToken, deleteNote);

export default router; 