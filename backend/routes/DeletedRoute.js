import express from 'express';
const router = express.Router();

import * as DeletedController from '../controllers/DeletedController.js';

router.get('/', DeletedController.getAllDeletedNotes);

router.put('/restore/:id', DeletedController.RestoreNote);

router.delete('/delete/:id', DeletedController.DeleteOneDeleted);

router.delete('/delete-all', DeletedController.DeleteAllDeleted);

export default router;