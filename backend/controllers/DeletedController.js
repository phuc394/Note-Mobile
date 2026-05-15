import * as DeletedService from '../services/DeletedService.js';

export async function getAllDeletedNotes(req, res) {
    const notes = await DeletedService.getAllDeletedNotes();
    res.json(notes);
}

export async function RestoreNote(req, res) {
    const { id } = req.params;

    const notes = await DeletedService.RestoreNote(id);

    res.json(notes);
}

export async function DeleteOneDeleted(req, res) {
    const { id } = req.params;

    const notes = await DeletedService.DeleteOneDeleted(id);

    res.json(notes);
}

export async function DeleteAllDeleted(req, res) {
    const notes = await DeletedService.DeleteAllDeleted();

    res.json(notes);
}