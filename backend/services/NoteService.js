import connection from '../config/database.js';

const db = connection.promise();

export async function GetNote(id) {
    const [notes] = await db.query('SELECT * FROM notes WHERE id = ? AND is_deleted = 0', [id]);
    return notes[0];
}

export async function GetAllNotes(userId) {
    const [notes] = await db.query(
        'SELECT * FROM notes WHERE user_id = ? AND is_deleted = 0 ORDER BY is_pinned DESC, id DESC', 
        [userId]
    );
    return notes;
}

export async function TogglePinNote(id, isPinned) {
    const [notes] = await db.query(
        'UPDATE notes SET is_pinned = ? WHERE id = ?',
        [isPinned, id]
    );
    return notes;
}

export async function SearchNotes(query) {
    const [notes] = await db.query(
        'SELECT * FROM notes WHERE title LIKE ? AND is_deleted = 0',
        [`%${query}%`]
    );
    return notes;
}

export async function DeleteNote(id) {
    const [notes] = await db.query(
        'UPDATE notes SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND is_deleted = 0',
        [id]
    );
    return notes;
}

export async function CreateNote(title, content, userId) {
    const [notes] = await db.query(
        'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
        [title, content, userId]
    );
    return notes;
}

export async function EditNote(id, title, content) {
    const [notes] = await db.query(
        'UPDATE notes SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
    );
    return notes;
}
