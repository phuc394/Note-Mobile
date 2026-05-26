import * as NoteService from '../services/NoteService.js';

function handleError(res, error, fallbackMessage = 'Loi Server') {
  return res.status(error.statusCode ?? 500).json({
    message: error.message || fallbackMessage,
  });
}

function toBoolean(value) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

export async function GetNote(req, res) {
  try {
    const { id } = req.params;
    const note = await NoteService.GetNote(id, req.user.id);
    return res.status(200).json(note);
  } catch (error) {
    return handleError(res, error, 'Loi khi lay chi tiet ghi chu');
  }
}

export async function GetAllNotes(req, res) {
  try {
    const notes = await NoteService.GetAllNotes(req.user.id);
    return res.status(200).json(notes);
  } catch (error) {
    return handleError(res, error, 'Loi khi lay danh sach ghi chu');
  }
}

export async function GetSharedNotes(req, res) {
  try {
    const notes = await NoteService.GetSharedNotes(req.user.id);
    return res.status(200).json(notes);
  } catch (error) {
    return handleError(res, error, 'Loi khi lay danh sach ghi chu duoc chia se');
  }
}

export async function TogglePinNote(req, res) {
  try {
    const { id } = req.params;
    const { is_pinned } = req.body;

    await NoteService.TogglePinNote(id, req.user.id, is_pinned);
    return res.status(200).json({
      message: toBoolean(is_pinned) ? 'Da ghim ghi chu' : 'Da bo ghim ghi chu',
    });
  } catch (error) {
    return handleError(res, error, 'Loi khi cap nhat trang thai ghim');
  }
}

export async function TogglePublicNote(req, res) {
  try {
    const { id } = req.params;
    const { is_public } = req.body;

    await NoteService.TogglePublicNote(id, req.user.id, is_public);
    return res.status(200).json({
      message: toBoolean(is_public)
        ? 'Da bat public cho ghi chu'
        : 'Da chuyen ghi chu ve private va xoa tat ca loi moi',
    });
  } catch (error) {
    return handleError(res, error, 'Loi khi cap nhat trang thai public/private');
  }
}

export async function InviteUserToNote(req, res) {
  try {
    const { id } = req.params;
    const { email, invited_gmail, can_edit } = req.body;
    const invite = await NoteService.InviteUserToNote(
      id,
      req.user.id,
      email ?? invited_gmail,
      can_edit,
    );

    return res.status(201).json({
      message: 'Da gui loi moi thanh cong',
      invite,
    });
  } catch (error) {
    return handleError(res, error, 'Loi khi moi nguoi dung vao ghi chu');
  }
}

export async function UpdateInvitePermission(req, res) {
  try {
    const { id } = req.params;
    const { email, invited_gmail, can_edit } = req.body;
    await NoteService.UpdateInvitePermission(
      id,
      req.user.id,
      email ?? invited_gmail,
      can_edit,
    );

    return res.status(200).json({
      message: 'Da cap nhat quyen cua nguoi duoc moi',
    });
  } catch (error) {
    return handleError(res, error, 'Loi khi cap nhat quyen chia se');
  }
}

export async function RemoveInvite(req, res) {
  try {
    const { id } = req.params;
    const { email } = req.params;
    await NoteService.RemoveInvite(id, req.user.id, email);
    return res.status(200).json({ message: 'Da xoa quyen truy cap ghi chu' });
  } catch (error) {
    return handleError(res, error, 'Loi khi xoa quyen chia se');
  }
}

export async function searchNotes(req, res) {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        message: 'Vui long nhap tu khoa tim kiem',
        data: [],
      });
    }

    const notes = await NoteService.searchNotes(req.user.id, keyword);
    return res.status(200).json({
      message: 'Tim kiem ghi chu thanh cong',
      data: notes,
    });
  } catch (error) {
    return handleError(res, error, 'Loi server khi tim kiem ghi chu');
  }
}

export async function DeleteNote(req, res) {
  try {
    const { id } = req.params;
    await NoteService.DeleteNote(id, req.user.id);
    return res.status(200).json({ message: 'Da xoa ghi chu' });
  } catch (error) {
    return handleError(res, error, 'Loi khi xoa ghi chu');
  }
}

export async function CreateNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = await NoteService.CreateNote(title, content, req.user.id);
    return res.status(201).json({
      message: 'Da tao ghi chu',
      note,
    });
  } catch (error) {
    return handleError(res, error, 'Loi khi tao ghi chu');
  }
}

export async function EditNote(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    await NoteService.EditNote(id, req.user.id, title, content);
    return res.status(200).json({ message: 'Da cap nhat ghi chu' });
  } catch (error) {
    return handleError(res, error, 'Loi khi cap nhat ghi chu');
  }
}
