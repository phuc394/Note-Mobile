import express from 'express';
import * as NoteController from '../controllers/NoteController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/get/:id', authMiddleware, NoteController.GetNote);
router.get('/all/:user_id', authMiddleware, NoteController.GetAllNotes);
router.patch('/pin/:id', authMiddleware, NoteController.TogglePinNote);
router.get("/search", authMiddleware, NoteController.searchNotes);
router.delete('/delete/:id', authMiddleware, NoteController.DeleteNote);
router.post('/create', authMiddleware, NoteController.CreateNote);
router.put('/edit/:id', authMiddleware, NoteController.EditNote);

export default router;
