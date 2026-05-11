const connection = require('../config/database');

async function SearchNotes(query) {
    const [notes] = await connection.query('SELECT * FROM notes WHERE title LIKE ?', [`%${query}%`]);
    return notes;
}

async function DeleteNote(id) {
    const [notes] = await connection.query('DELETE FROM notes WHERE id = ?', [id]);
    return notes;
}
























































































module.exports = {
    SearchNotes,
    DeleteNote
};