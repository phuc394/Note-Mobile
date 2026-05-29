import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { isProduction } from '../config/env.js';
import connection from '../config/database.js';
import { emitSharedNoteUpdated } from '../socket.js';

const db = connection.promise();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inviteTemplatePath = path.join(__dirname, '../templates/noteInvite.hbs');

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

function createMailTransporter() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
  }

  return nodemailer.createTransport({ jsonTransport: true });
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
  const source = await fs.readFile(inviteTemplatePath, 'utf8');
  const template = handlebars.compile(source);
  const frontendUrl = getFrontendUrl();
  const inviteUrl = `${frontendUrl.replace(/\/$/, '')}/notes/${note.id}`;
  const html = template({
    inviteUrl,
    noteTitle: note.title,
    inviterName: inviter.username,
    permission: canEdit ? 'doc va chinh sua' : 'chi doc',
  });

  const transporter = createMailTransporter();
  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER ?? 'Note Mobile <no-reply@note-mobile.local>',
    to: invitedEmail,
    subject: `${inviter.username} invited you to a note`,
    html,
  });
}

function notFoundError(message = 'Khong tim thay ghi chu') {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

function forbiddenError(message = 'Ban khong co quyen thuc hien thao tac nay') {
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
    throw notFoundError('Khong tim thay ghi chu cua ban');
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
    const error = new Error('Email nguoi duoc moi la bat buoc');
    error.statusCode = 400;
    throw error;
  }

  const owner = await getCurrentUser(userId);
  const note = await getOwnedNote(id, userId);

  if (!note.is_public) {
    throw forbiddenError('Chi co the moi nguoi khac khi note dang public');
  }

  if (owner.email.toLowerCase() === email) {
    const error = new Error('Khong the moi chinh ban vao note cua ban');
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

export async function UpdateInvitePermission(id, userId, invitedEmail, canEdit) {
  const email = invitedEmail?.trim().toLowerCase();
  if (!email) {
    const error = new Error('Email nguoi duoc moi la bat buoc');
    error.statusCode = 400;
    throw error;
  }

  await getOwnedNote(id, userId);
  const [result] = await db.query(
    'UPDATE shared_notes SET can_edit = ? WHERE note_id = ? AND LOWER(invited_gmail) = LOWER(?)',
    [toBoolean(canEdit), id, email],
  );

  if (result.affectedRows === 0) {
    throw notFoundError('Khong tim thay loi moi');
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
    const error = new Error('Tieu de ghi chu la bat buoc');
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
    throw forbiddenError('Ban chi co quyen xem ghi chu nay');
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
  return result;
}
