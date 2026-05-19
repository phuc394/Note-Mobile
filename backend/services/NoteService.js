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

export async function searchNotes(userId, keyword) {
  return new Promise((resolve, reject) => {
    const searchKeyword = `%${keyword.trim()}%`;

    const sql = `
      SELECT 
        id,
        title,
        content,
        user_id,
        is_public,
        is_pinned,
        is_deleted,
        created_at,
        updated_at
      FROM notes
      WHERE user_id = ?
        AND is_deleted = 0
        AND (
          title LIKE ?
          OR content LIKE ?
        )
      ORDER BY is_pinned DESC, updated_at DESC
    `;

    connection.query(
      sql,
      [userId, searchKeyword, searchKeyword],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      },
    );
  });
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
