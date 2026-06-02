import * as SharedService from '../services/SharedService.js';

function handleError(res, error, fallbackMessage = 'Server error') {
  return res.status(error.statusCode ?? 500).json({
    message: error.message || fallbackMessage,
  });
}

export async function getAllSharedNotes(req, res) {
  try {
    const notes = await SharedService.getAllSharedNotes(req.user.id);
    return res.status(200).json(notes);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch shared notes');
  }
}

export async function getSharedNote(req, res) {
  try {
    const { id } = req.params;
    const note = await SharedService.getSharedNote(id, req.user.id);
    return res.status(200).json(note);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch shared note details');
  }
}

export async function replaceSharedNoteContent(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await SharedService.replaceSharedNoteContent(id, req.user.id, content);
    return res.status(200).json({ message: 'Shared note content updated' });
  } catch (error) {
    return handleError(res, error, 'Failed to update shared note content');
  }
}

export async function appendSharedNoteContent(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    await SharedService.appendSharedNoteContent(id, req.user.id, content);
    return res.status(200).json({ message: 'Content appended to shared note' });
  } catch (error) {
    return handleError(res, error, 'Failed to append shared note content');
  }
}

export async function clearSharedNoteContent(req, res) {
  try {
    const { id } = req.params;
    await SharedService.clearSharedNoteContent(id, req.user.id);
    return res.status(200).json({ message: 'Shared note content cleared' });
  } catch (error) {
    return handleError(res, error, 'Failed to clear shared note content');
  }
}
