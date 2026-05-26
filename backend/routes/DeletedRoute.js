import express from 'express';
import authMiddleware from '../middleware/AuthMiddleware.js';
import * as DeletedController from '../controllers/DeletedController.js';

const router = express.Router();

router.get('/', authMiddleware, DeletedController.getAllDeletedNotes);
router.get('/search', authMiddleware, DeletedController.searchDeletedNotes);
router.get('/:id', authMiddleware, DeletedController.getDeletedNote);

router.put('/restore/:id', authMiddleware, DeletedController.RestoreNote);

router.delete('/delete-many', authMiddleware, DeletedController.DeleteManyDeleted);
router.delete('/delete-all', authMiddleware, DeletedController.DeleteAllDeleted);
router.delete('/delete/:id', authMiddleware, DeletedController.DeleteOneDeleted);

export default router;
