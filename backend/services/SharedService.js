import connection from '../config/database.js';
import { emitSharedNoteUpdated } from '../socket.js';

const db = connection.promise();

function notFoundError(message = 'Shared note not found') {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

function forbiddenError(message = 'You do not have permission to edit this note') {
  const error = new Error(message);
  error.statusCode = 403;
  return error;
}

function badRequestError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

async function getCurrentUser(userId) {
  const [users] = await db.query(
    'SELECT id, username, email FROM users WHERE id = ?',
    [userId],
  );

  if (!users[0]) {
    throw notFoundError('User not found');
  }

  return users[0];
}

export async function getSharedNoteAccess(noteId, userId) {
  const user = await getCurrentUser(userId);
  const [notes] = await db.query(
    `
      SELECT
        n.id,
        n.title,
        n.content,
        n.user_id,
        n.is_public,
        n.is_pinned,
        n.is_deleted,
        n.created_at,
        n.updated_at,
        sn.can_edit AS can_edit,
        sn.created_at AS shared_at,
        owner.username AS owner_username,
        owner.email AS owner_email
      FROM shared_notes sn
      INNER JOIN notes n ON n.id = sn.note_id
      INNER JOIN users owner ON owner.id = n.user_id
      WHERE sn.note_id = ?
        AND LOWER(sn.invited_gmail) = LOWER(?)
        AND n.is_public = 1
        AND n.is_deleted = 0
      LIMIT 1
    `,
    [noteId, user.email],
  );

  if (!notes[0]) {
    throw notFoundError();
  }

  return notes[0];
}

function ensureCanEdit(note) {
  if (!note.can_edit) {
    throw forbiddenError('You only have permission to read this note');
  }
}

async function emitLatestNote(noteId, action, editorId) {
  const [notes] = await db.query(
    `
      SELECT id, title, content, user_id, is_public, is_pinned, updated_at
      FROM notes
      WHERE id = ?
      LIMIT 1
    `,
    [noteId],
  );

  emitSharedNoteUpdated(noteId, {
    action,
    editor_id: editorId,
    note: notes[0],
  });
}

export async function getAllSharedNotes(userId) {
  const user = await getCurrentUser(userId);
  const [notes] = await db.query(
    `
      SELECT
        n.id,
        n.title,
        n.content,
        n.user_id,
        n.is_public,
        n.is_pinned,
        n.created_at,
        n.updated_at,
        sn.can_edit,
        sn.created_at AS shared_at,
        owner.username AS owner_username,
        owner.email AS owner_email
      FROM shared_notes sn
      INNER JOIN notes n ON n.id = sn.note_id
      INNER JOIN users owner ON owner.id = n.user_id
      WHERE LOWER(sn.invited_gmail) = LOWER(?)
        AND n.is_public = 1
        AND n.is_deleted = 0
      ORDER BY n.is_pinned DESC, n.updated_at DESC, n.created_at DESC
    `,
    [user.email],
  );

  return notes;
}

export async function getSharedNote(id, userId) {
  return getSharedNoteAccess(id, userId);
}

export async function replaceSharedNoteContent(id, userId, content) {
  if (content === undefined || content === null) {
    throw badRequestError('Note content is required');
  }

  const note = await getSharedNoteAccess(id, userId);
  ensureCanEdit(note);

  const [result] = await db.query(
    `
      UPDATE notes
      SET content = ?
      WHERE id = ?
        AND is_public = 1
        AND is_deleted = 0
    `,
    [content, id],
  );

  await emitLatestNote(id, 'replace-content', userId);
  return result;
}

export async function appendSharedNoteContent(id, userId, content) {
  if (!content?.trim()) {
    throw badRequestError('Content to append is required');
  }

  const note = await getSharedNoteAccess(id, userId);
  ensureCanEdit(note);

  const separator = note.content ? '\n' : '';
  const [result] = await db.query(
    `
      UPDATE notes
      SET content = CONCAT(COALESCE(content, ''), ?, ?)
      WHERE id = ?
        AND is_public = 1
        AND is_deleted = 0
    `,
    [separator, content, id],
  );

  await emitLatestNote(id, 'append-content', userId);
  return result;
}

export async function clearSharedNoteContent(id, userId) {
  const note = await getSharedNoteAccess(id, userId);
  ensureCanEdit(note);

  const [result] = await db.query(
    `
      UPDATE notes
      SET content = ''
      WHERE id = ?
        AND is_public = 1
        AND is_deleted = 0
    `,
    [id],
  );

  await emitLatestNote(id, 'clear-content', userId);
  return result;
}
