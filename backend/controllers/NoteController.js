import * as NoteService from '../services/NoteService.js';

function handleError(res, error, fallbackMessage = 'Server error') {
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
    return handleError(res, error, 'Failed to fetch note details');
  }
}

export async function GetAllNotes(req, res) {
  try {
    const notes = await NoteService.GetAllNotes(req.user.id);
    return res.status(200).json(notes);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch notes');
  }
}

export async function GetSharedNotes(req, res) {
  try {
    const notes = await NoteService.GetSharedNotes(req.user.id);
    return res.status(200).json(notes);
  } catch (error) {
    return handleError(res, error, 'Failed to fetch shared notes');
  }
}

export async function TogglePinNote(req, res) {
  try {
    const { id } = req.params;
    const { is_pinned } = req.body;

    await NoteService.TogglePinNote(id, req.user.id, is_pinned);
    return res.status(200).json({
      message: toBoolean(is_pinned) ? 'Note pinned' : 'Note unpinned',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to update pin status');
  }
}

export async function TogglePublicNote(req, res) {
  try {
    const { id } = req.params;
    const { is_public } = req.body;

    await NoteService.TogglePublicNote(id, req.user.id, is_public);
    return res.status(200).json({
      message: toBoolean(is_public)
        ? 'Note is now public'
        : 'Note is now private and all invites were removed',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to update visibility');
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
      message: 'Invite sent successfully',
      invite,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to invite user to note');
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
      message: 'Invite permission updated',
    });
  } catch (error) {
    return handleError(res, error, 'Failed to update sharing permission');
  }
}

export async function RemoveInvite(req, res) {
  try {
    const { id } = req.params;
    const { email } = req.params;
    await NoteService.RemoveInvite(id, req.user.id, email);
    return res.status(200).json({ message: 'Note access removed' });
  } catch (error) {
    return handleError(res, error, 'Failed to remove sharing permission');
  }
}

export async function searchNotes(req, res) {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        message: 'Please enter a search keyword',
        data: [],
      });
    }

    const notes = await NoteService.searchNotes(req.user.id, keyword);
    return res.status(200).json({
      message: 'Notes searched successfully',
      data: notes,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to search notes');
  }
}

export async function DeleteNote(req, res) {
  try {
    const { id } = req.params;
    await NoteService.DeleteNote(id, req.user.id);
    return res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    return handleError(res, error, 'Failed to delete note');
  }
}

export async function CreateNote(req, res) {
  try {
    const { title, content } = req.body;
    const note = await NoteService.CreateNote(title, content, req.user.id);
    return res.status(201).json({
      message: 'Note created',
      note,
    });
  } catch (error) {
    return handleError(res, error, 'Failed to create note');
  }
}

export async function EditNote(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    await NoteService.EditNote(id, req.user.id, title, content);
    return res.status(200).json({ message: 'Note updated' });
  } catch (error) {
    return handleError(res, error, 'Failed to update note');
  }
}
