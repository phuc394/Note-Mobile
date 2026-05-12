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

async function CreateNote(req, res) {
    const { title, content, user_id } = req.body; 
    const notes = await NoteService.CreateNote(title, content, user_id);
    res.json(notes);
}

async function EditNote(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const notes = await NoteService.EditNote(id, title, content);
    res.json(notes);
}

async function getAllNotes(req, res) {
    const notes = await NoteService.getAllNotes();
    res.json(notes);
}

async function getNoteById(req, res) {
    const { id } = req.params;
    const notes = await NoteService.getNoteById(id);
    res.json(notes);
}

module.exports = {
    CreateNote,
    EditNote,
    SearchNotes,
    DeleteNote,
    getAllNotes,
    getNoteById
};