const connection = require('../config/database');

async function SearchNotes(query) {
    const [notes] = await connection.query('SELECT * FROM notes WHERE title LIKE ?', [`%${query}%`]);
    return notes;
}

async function DeleteNote(id) {
    const [notes] = await connection.query('DELETE FROM notes WHERE id = ?', [id]);
    return notes;
}

async function CreateNote(title, content, userId) {
    const [notes] = await connection.query(
        'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
        [title, content, userId]
    );
    return notes;
}

async function EditNote(id, title, content) {
    const [notes] = await connection.query(
        'UPDATE notes SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
    );
    return notes;
}

async function getAllNotes() {
    const [notes] = await connection.query('SELECT * FROM notes');
    return notes;
}

async function getNoteById(id) {
    const [notes] = await connection.query(
        'SELECT * FROM notes WHERE id = ?',
        [id]
    );
    return notes;
}


module.exports = {
    SearchNotes,
    DeleteNote,
    CreateNote,
    EditNote,
    getAllNotes,
    getNoteById
};

















































































