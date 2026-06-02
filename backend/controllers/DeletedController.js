import * as DeletedService from '../services/DeletedService.js';

function handleError(res, error, fallbackMessage = 'Server error') {
  return res.status(error.statusCode ?? 500).json({
    message: error.message || fallbackMessage,
  });
}

export async function getAllDeletedNotes(req, res) {
  try {
    const notes = await DeletedService.getAllDeletedNotes(req.user.id);
    return res.status(200).json(notes);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch deleted notes');
  }
}

export async function getDeletedNote(req, res) {
  try {
    const { id } = req.params;
    const note = await DeletedService.getDeletedNote(id, req.user.id);
    return res.status(200).json(note);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch deleted note details');
  }
}

export async function searchDeletedNotes(req, res) {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        message: 'Please enter a search keyword',
        data: [],
      });
    }

    const notes = await DeletedService.searchDeletedNotes(req.user.id, keyword);
    return res.status(200).json({
      message: 'Deleted notes searched successfully',
      data: notes,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to search deleted notes');
  }
}

export async function RestoreNote(req, res) {
  try {
    const { id } = req.params;
    await DeletedService.RestoreNote(id, req.user.id);
    return res.status(200).json({ message: 'Note restored' });
  } catch (error) {
    return handleError(res, error, 'Failed to restore note');
  }
}

export async function DeleteOneDeleted(req, res) {
  try {
    const { id } = req.params;
    await DeletedService.DeleteOneDeleted(id, req.user.id);
    return res.status(200).json({ message: 'Note permanently deleted' });
  } catch (error) {
    return handleError(res, error, 'Failed to permanently delete note');
  }
}

export async function DeleteManyDeleted(req, res) {
  try {
    const { ids } = req.body;
    const result = await DeletedService.DeleteManyDeleted(ids, req.user.id);
    return res.status(200).json({
      message: 'Selected notes permanently deleted',
      deleted_count: result.affectedRows,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to permanently delete selected notes');
  }
}

export async function DeleteAllDeleted(req, res) {
  try {
    const result = await DeletedService.DeleteAllDeleted(req.user.id);
    return res.status(200).json({
      message: 'Trash emptied',
      deleted_count: result.affectedRows,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to empty trash');
  }
}
