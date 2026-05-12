const express = require('express');
const router = express.Router();
const NoteController = require('../controllers/NoteController');


router.get('/search/:query', NoteController.SearchNotes);
router.delete('/delete/:id', NoteController.DeleteNote);
router.post('/create', NoteController.CreateNote);
router.put('/edit/:id', NoteController.EditNote); 
router.get('/', NoteController.getAllNotes);
router.get('/:id', NoteController.getNoteById);
router.get('/search/:query', NoteController.SearchNotes);

module.exports = router;