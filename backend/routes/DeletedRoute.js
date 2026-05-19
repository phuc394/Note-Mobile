import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

import * as DeletedController from '../controllers/DeletedController.js';

router.get('/', authMiddleware, DeletedController.getAllDeletedNotes);

router.put('/restore/:id', authMiddleware, DeletedController.RestoreNote);

router.delete('/delete/:id', authMiddleware, DeletedController.DeleteOneDeleted);

router.delete('/delete-all', authMiddleware, DeletedController.DeleteAllDeleted);

export default router;