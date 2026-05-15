import connection from "../config/database.js";

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
