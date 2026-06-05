import emailjs, { EmailJSResponseStatus } from '@emailjs/nodejs';
import { isProduction } from '../config/env.js';
import connection from '../config/database.js';
import { emitSharedNoteUpdated } from '../socket.js';

const db = connection.promise();

async function getUserById(userId) {
  const [users] = await db.query(
    'SELECT id, username, email FROM users WHERE id = ?',
    [userId],
  );
  return users[0];
}

async function getCurrentUser(userId) {
  const user = await getUserById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

function getRequiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required to send invite emails`);
  }
  return value;
}

function toBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

function getFrontendUrl() {
  const frontendUrl = process.env.FRONTEND_URL ?? process.env.CLIENT_ORIGIN?.split(',')[0]?.trim();

  if (frontendUrl) {
    return frontendUrl;
  }

  if (isProduction) {
    throw new Error('FRONTEND_URL or CLIENT_ORIGIN is required to send invite emails');
  }

  return 'http://localhost:3000';
}

async function sendInviteEmail({ invitedEmail, note, inviter, canEdit }) {
  const frontendUrl = getFrontendUrl();
  const inviteUrl = `${frontendUrl.replace(/\/$/, '')}/notes/${note.id}`;

  try {
    await emailjs.send(
      getRequiredEnv('EMAILJS_SERVICE_ID'),
      getRequiredEnv('EMAILJS_TEMPLATE_ID'),
      {
        email: invitedEmail,
        inviter_name: inviter.username,
        note_title: note.title,
        invite_url: inviteUrl,
        permission: canEdit ? 'view and edit' : 'view only',
      },
      {
        publicKey: getRequiredEnv('EMAILJS_PUBLIC_KEY'),
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      },
    );
  } catch (error) {
    const sendError = new Error(
      error instanceof EmailJSResponseStatus
        ? `EmailJS failed: ${error.text}`
        : error.message ?? 'Failed to send invite email',
    );
    sendError.statusCode = 502;
    throw sendError;
  }
}

function notFoundError(message = 'Note not found') {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

function forbiddenError(message = 'You do not have permission to perform this action') {
  const error = new Error(message);
  error.statusCode = 403;
  return error;
}

async function getNoteWithAccess(noteId, userId) {
  const user = await getCurrentUser(userId);
  const [notes] = await db.query(
    `
      SELECT
        n.*,
        sn.can_edit AS shared_can_edit,
        CASE WHEN n.user_id = ? THEN 1 ELSE 0 END AS is_owner
      FROM notes n
      LEFT JOIN shared_notes sn
        ON sn.note_id = n.id
        AND LOWER(sn.invited_gmail) = LOWER(?)
      WHERE n.id = ?
        AND n.is_deleted = 0
        AND (
          n.user_id = ?
          OR (n.is_public = 1 AND sn.id IS NOT NULL)
        )
      LIMIT 1
    `,
    [userId, user.email, noteId, userId],
  );

  return notes[0];
}

async function getOwnedNote(noteId, userId) {
  const [notes] = await db.query(
    'SELECT * FROM notes WHERE id = ? AND user_id = ? AND is_deleted = 0 LIMIT 1',
    [noteId, userId],
  );

  if (!notes[0]) {
    throw notFoundError('Your note was not found');
  }

  return notes[0];
}

export async function GetNote(id, userId) {
  const note = await getNoteWithAccess(id, userId);
  if (!note) {
    throw notFoundError();
  }
  return note;
}

export async function GetAllNotes(userId) {
  const [notes] = await db.query(
    `
      SELECT *
      FROM notes
      WHERE user_id = ?
        AND is_deleted = 0
      ORDER BY is_pinned DESC, updated_at DESC, created_at DESC
    `,
    [userId],
  );
  return notes;
}

export async function GetSharedNotes(userId) {
  const user = await getCurrentUser(userId);
  const [notes] = await db.query(
    `
      SELECT
        n.*,
        sn.can_edit AS shared_can_edit,
        sn.created_at AS shared_at
      FROM shared_notes sn
      INNER JOIN notes n ON n.id = sn.note_id
      WHERE LOWER(sn.invited_gmail) = LOWER(?)
        AND n.is_public = 1
        AND n.is_deleted = 0
      ORDER BY n.is_pinned DESC, n.updated_at DESC, n.created_at DESC
    `,
    [user.email],
  );
  return notes;
}

export async function TogglePinNote(id, userId, isPinned) {
  await getOwnedNote(id, userId);
  const [result] = await db.query(
    'UPDATE notes SET is_pinned = ? WHERE id = ?',
    [toBoolean(isPinned), id],
  );
  return result;
}

export async function TogglePublicNote(id, userId, isPublic) {
  await getOwnedNote(id, userId);
  const nextPublicValue = toBoolean(isPublic);

  const [result] = await db.query(
    'UPDATE notes SET is_public = ? WHERE id = ?',
    [nextPublicValue, id],
  );

  if (!nextPublicValue) {
    emitSharedNoteUpdated(id, {
      action: 'access-revoked',
      note_id: Number(id),
    });
    await db.query('DELETE FROM shared_notes WHERE note_id = ?', [id]);
  }

  return result;
}

export async function InviteUserToNote(id, userId, invitedEmail, canEdit = false) {
  const email = invitedEmail?.trim().toLowerCase();
  if (!email) {
    const error = new Error('Invitee email is required');
    error.statusCode = 400;
    throw error;
  }

  const owner = await getCurrentUser(userId);
  const note = await getOwnedNote(id, userId);

  if (!note.is_public) {
    throw forbiddenError('You can only invite users when the note is public');
  }

  if (owner.email.toLowerCase() === email) {
    const error = new Error('You cannot invite yourself to your own note');
    error.statusCode = 400;
    throw error;
  }

  await db.query(
    `
      INSERT INTO shared_notes (note_id, invited_gmail, can_edit)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        can_edit = VALUES(can_edit)
    `,
    [id, email, toBoolean(canEdit)],
  );

  await sendInviteEmail({
    invitedEmail: email,
    note,
    inviter: owner,
    canEdit: toBoolean(canEdit),
  });

  return { note_id: Number(id), invited_gmail: email, can_edit: toBoolean(canEdit) };
}

export async function GetNoteInvites(id, userId) {
  await getOwnedNote(id, userId);
  const [invites] = await db.query(
    `
      SELECT
        sn.id,
        sn.note_id,
        sn.invited_gmail,
        sn.can_edit,
        sn.created_at,
        u.username,
        u.email AS user_email
      FROM shared_notes sn
      LEFT JOIN users u ON LOWER(u.email) = LOWER(sn.invited_gmail)
      WHERE sn.note_id = ?
      ORDER BY sn.created_at DESC
    `,
    [id],
  );

  return invites;
}

export async function UpdateInvitePermission(id, userId, invitedEmail, canEdit) {
  const email = invitedEmail?.trim().toLowerCase();
  if (!email) {
    const error = new Error('Invitee email is required');
    error.statusCode = 400;
    throw error;
  }

  await getOwnedNote(id, userId);
  const [result] = await db.query(
    'UPDATE shared_notes SET can_edit = ? WHERE note_id = ? AND LOWER(invited_gmail) = LOWER(?)',
    [toBoolean(canEdit), id, email],
  );

  if (result.affectedRows === 0) {
    throw notFoundError('Invite not found');
  }

  return result;
}

export async function RemoveInvite(id, userId, invitedEmail) {
  const email = invitedEmail?.trim().toLowerCase();
  await getOwnedNote(id, userId);
  const [result] = await db.query(
    'DELETE FROM shared_notes WHERE note_id = ? AND LOWER(invited_gmail) = LOWER(?)',
    [id, email],
  );
  if (result.affectedRows > 0) {
    emitSharedNoteUpdated(id, {
      action: 'access-revoked',
      note_id: Number(id),
      invited_gmail: email,
    });
  }
  return result;
}

export async function searchNotes(userId, keyword) {
  const user = await getCurrentUser(userId);
  const searchKeyword = `%${keyword.trim()}%`;

  const [results] = await db.query(
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
        sn.can_edit AS shared_can_edit
      FROM notes n
      LEFT JOIN shared_notes sn
        ON sn.note_id = n.id
        AND LOWER(sn.invited_gmail) = LOWER(?)
      WHERE n.is_deleted = 0
        AND (
          n.user_id = ?
          OR (n.is_public = 1 AND sn.id IS NOT NULL)
        )
        AND (
          n.title LIKE ?
          OR n.content LIKE ?
        )
      ORDER BY n.is_pinned DESC, n.updated_at DESC, n.created_at DESC
    `,
    [user.email, userId, searchKeyword, searchKeyword],
  );

  return results;
}

export async function DeleteNote(id, userId) {
  await getOwnedNote(id, userId);
  const [result] = await db.query(
    'UPDATE notes SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND is_deleted = 0',
    [id],
  );
  emitSharedNoteUpdated(id, {
    action: 'deleted',
    note_id: Number(id),
    editor_id: userId,
  });
  return result;
}

export async function CreateNote(title, content, userId) {
  if (!title?.trim()) {
    const error = new Error('Note title is required');
    error.statusCode = 400;
    throw error;
  }

  const [result] = await db.query(
    'INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)',
    [title.trim(), content ?? '', userId],
  );

  return {
    id: result.insertId,
    title: title.trim(),
    content: content ?? '',
    user_id: userId,
  };
}

export async function EditNote(id, userId, title, content) {
  const note = await getNoteWithAccess(id, userId);
  if (!note) {
    throw notFoundError();
  }

  if (!note.is_owner && !note.shared_can_edit) {
    throw forbiddenError('You only have permission to view this note');
  }

  const nextTitle = note.is_owner ? title?.trim() || note.title : note.title;
  const nextContent = content ?? '';

  const [result] = await db.query(
    'UPDATE notes SET title = ?, content = ? WHERE id = ?',
    [nextTitle, nextContent, id],
  );
  emitSharedNoteUpdated(id, {
    action: 'updated',
    editor_id: userId,
    note: {
      id: Number(id),
      title: nextTitle,
      content: nextContent,
    },
  });
  return {
    id: Number(id),
    title: nextTitle,
    content: nextContent,
    affectedRows: result.affectedRows,
  };
}
