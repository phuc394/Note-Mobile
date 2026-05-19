import connection from '../config/database.js';
const db = connection.promise();

export async function getAllDeletedNotes() {
    const [notes] = await db.query(
        'SELECT * FROM notes WHERE is_deleted = 1'
    );

    return notes;
}

export async function RestoreNote(id) {
    const [notes] = await db.query(
        'UPDATE notes SET is_deleted = 0 WHERE id = ?',
        [id]
    );

    return notes;
}

export async function DeleteOneDeleted(id) {
    const [notes] = await db.query(
        'DELETE FROM notes WHERE id = ?',
        [id]
    );

    return notes;
}

export async function DeleteAllDeleted() {
    const [notes] = await db.query(
        'DELETE FROM notes WHERE is_deleted = 1'
    );

    return notes;
}