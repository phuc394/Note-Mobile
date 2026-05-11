const express = require('express');
const router = express.Router();
const NoteController = require('../controllers/NoteController');

router.get('/search/:query', NoteController.SearchNotes);
router.delete('/delete/:id', NoteController.DeleteNote);

module.exports = router;