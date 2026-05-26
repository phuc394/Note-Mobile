import express from 'express';
import * as NoteController from '../controllers/NoteController.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.get('/all', authMiddleware, NoteController.GetAllNotes);
router.get('/all/:user_id', authMiddleware, NoteController.GetAllNotes);
router.get('/shared', authMiddleware, NoteController.GetSharedNotes);
router.get('/search', authMiddleware, NoteController.searchNotes);
router.get('/get/:id', authMiddleware, NoteController.GetNote);

router.post('/create', authMiddleware, NoteController.CreateNote);
router.post('/:id/invite', authMiddleware, NoteController.InviteUserToNote);

router.put('/edit/:id', authMiddleware, NoteController.EditNote);
router.patch('/pin/:id', authMiddleware, NoteController.TogglePinNote);
router.patch('/public/:id', authMiddleware, NoteController.TogglePublicNote);
router.patch('/:id/invite', authMiddleware, NoteController.UpdateInvitePermission);

router.delete('/delete/:id', authMiddleware, NoteController.DeleteNote);
router.delete('/:id/invite/:email', authMiddleware, NoteController.RemoveInvite);

export default router;
