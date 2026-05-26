import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import * as SharedController from '../controllers/SharedController.js';

const router = express.Router();

router.get('/', authMiddleware, SharedController.getAllSharedNotes);
router.get('/:id', authMiddleware, SharedController.getSharedNote);

router.post('/:id/content', authMiddleware, SharedController.appendSharedNoteContent);
router.put('/:id/content', authMiddleware, SharedController.replaceSharedNoteContent);
router.delete('/:id/content', authMiddleware, SharedController.clearSharedNoteContent);

export default router;
