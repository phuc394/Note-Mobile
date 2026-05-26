import connection from '../config/database.js';

const db = connection.promise();

function notFoundError(message = 'Khong tim thay ghi chu da xoa') {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

function badRequestError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

async function getDeletedNoteByOwner(id, userId) {
  const [notes] = await db.query(
    `
      SELECT *
      FROM notes
      WHERE id = ?
        AND user_id = ?
        AND is_deleted = 1
      LIMIT 1
    `,
    [id, userId],
  );

  if (!notes[0]) {
    throw notFoundError();
  }

  return notes[0];
}

function normalizeIds(ids) {
  if (!Array.isArray(ids)) {
    throw badRequestError('Danh sach id ghi chu la bat buoc');
  }

  const normalizedIds = [...new Set(ids.map(Number))].filter(Number.isInteger);
  if (normalizedIds.length === 0) {
    throw badRequestError('Danh sach id ghi chu khong hop le');
  }

  return normalizedIds;
}

export async function getAllDeletedNotes(userId) {
  const [notes] = await db.query(
    `
      SELECT *
      FROM notes
      WHERE user_id = ?
        AND is_deleted = 1
      ORDER BY deleted_at DESC, updated_at DESC
    `,
    [userId],
  );

  return notes;
}

export async function getDeletedNote(id, userId) {
  return getDeletedNoteByOwner(id, userId);
}

export async function searchDeletedNotes(userId, keyword) {
  const searchKeyword = `%${keyword.trim()}%`;
  const [notes] = await db.query(
    `
      SELECT *
      FROM notes
      WHERE user_id = ?
        AND is_deleted = 1
        AND (
          title LIKE ?
          OR content LIKE ?
        )
      ORDER BY deleted_at DESC, updated_at DESC
    `,
    [userId, searchKeyword, searchKeyword],
  );

  return notes;
}

export async function RestoreNote(id, userId) {
  await getDeletedNoteByOwner(id, userId);
  const [result] = await db.query(
    `
      UPDATE notes
      SET is_deleted = 0,
          deleted_at = NULL
      WHERE id = ?
        AND user_id = ?
        AND is_deleted = 1
    `,
    [id, userId],
  );

  return result;
}

export async function DeleteOneDeleted(id, userId) {
  await getDeletedNoteByOwner(id, userId);
  const [result] = await db.query(
    `
      DELETE FROM notes
      WHERE id = ?
        AND user_id = ?
        AND is_deleted = 1
    `,
    [id, userId],
  );

  return result;
}

export async function DeleteManyDeleted(ids, userId) {
  const normalizedIds = normalizeIds(ids);
  const placeholders = normalizedIds.map(() => '?').join(', ');
  const [result] = await db.query(
    `
      DELETE FROM notes
      WHERE user_id = ?
        AND is_deleted = 1
        AND id IN (${placeholders})
    `,
    [userId, ...normalizedIds],
  );

  return result;
}

export async function DeleteAllDeleted(userId) {
  const [result] = await db.query(
    `
      DELETE FROM notes
      WHERE user_id = ?
        AND is_deleted = 1
    `,
    [userId],
  );

  return result;
}
