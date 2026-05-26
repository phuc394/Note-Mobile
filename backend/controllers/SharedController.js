import * as SharedService from '../services/SharedService.js';

function handleError(res, error, fallbackMessage = 'Loi Server') {
  return res.status(error.statusCode ?? 500).json({
    message: error.message || fallbackMessage,
  });
}

export async function getAllSharedNotes(req, res) {
  try {
    const notes = await SharedService.getAllSharedNotes(req.user.id);
    return res.status(200).json(notes);
  } catch (error) {
    return handleError(res, error, 'Loi khi lay danh sach ghi chu duoc chia se');
  }
}

export async function getSharedNote(req, res) {
  try {
    const { id } = req.params;
    const note = await SharedService.getSharedNote(id, req.user.id);
    return res.status(200).json(note);
  } catch (error) {
    return handleError(res, error, 'Loi khi lay chi tiet ghi chu duoc chia se');
  }
}

export async function replaceSharedNoteContent(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await SharedService.replaceSharedNoteContent(id, req.user.id, content);
    return res.status(200).json({ message: 'Da cap nhat noi dung ghi chu duoc chia se' });
  } catch (error) {
    return handleError(res, error, 'Loi khi cap nhat noi dung ghi chu duoc chia se');
  }
}

export async function appendSharedNoteContent(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await SharedService.appendSharedNoteContent(id, req.user.id, content);
    return res.status(200).json({ message: 'Da them noi dung vao ghi chu duoc chia se' });
  } catch (error) {
    return handleError(res, error, 'Loi khi them noi dung vao ghi chu duoc chia se');
  }
}

export async function clearSharedNoteContent(req, res) {
  try {
    const { id } = req.params;
    await SharedService.clearSharedNoteContent(id, req.user.id);
    return res.status(200).json({ message: 'Da xoa noi dung ghi chu duoc chia se' });
  } catch (error) {
    return handleError(res, error, 'Loi khi xoa noi dung ghi chu duoc chia se');
  }
}
