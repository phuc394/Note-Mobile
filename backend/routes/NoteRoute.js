import express from 'express';
import * as NoteController from '../controllers/NoteController.js';

const router = express.Router();

router.get('/get/:id', NoteController.GetNote);
router.get('/all/:user_id', NoteController.GetAllNotes);
router.patch('/pin/:id', NoteController.TogglePinNote);
router.get('/search/:query', NoteController.SearchNotes);
router.delete('/delete/:id', NoteController.DeleteNote);
router.post('/create', NoteController.CreateNote);
router.put('/edit/:id', NoteController.EditNote);

export default router;
