const express = require('express');
const router = express.Router();
const NoteController = require('../controllers/NoteController');

router.get('/get/:id', NoteController.GetNote);
router.get('/all/:user_id', NoteController.GetAllNotes);
router.patch('/pin/:id', NoteController.TogglePinNote);
router.get('/search/:query', NoteController.SearchNotes);
router.delete('/delete/:id', NoteController.DeleteNote);
router.post('/create', NoteController.CreateNote);
router.put('/edit/:id', NoteController.EditNote); 

module.exports = router;
