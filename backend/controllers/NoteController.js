const NoteService = require('../services/NoteService');

async function SearchNotes(req, res) {
    const { query } = req.params;
    const notes = await NoteService.SearchNotes(query);
    res.json(notes);
}

async function DeleteNote(req, res) {
    const { id } = req.params;
    const notes = await NoteService.DeleteNote(id);
    res.json(notes);
}

module.exports = {
    SearchNotes,
    DeleteNote
};