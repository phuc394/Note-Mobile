import * as DeletedService from '../services/DeletedService.js';

export async function getAllDeletedNotes(req, res) {
    try {
        const notes = await DeletedService.getAllDeletedNotes();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving deleted notes", error: error.message });
    }
}

export async function RestoreNote(req, res) {
    try {
        const { id } = req.params;
        const notes = await DeletedService.RestoreNote(id);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error restoring note", error: error.message });
    }
}

export async function DeleteOneDeleted(req, res) {
    try {
        const { id } = req.params;
        const notes = await DeletedService.DeleteOneDeleted(id);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error deleting note from trash", error: error.message });
    }
}

export async function DeleteAllDeleted(req, res) {
    try {
        const notes = await DeletedService.DeleteAllDeleted();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error clearing trash", error: error.message });
    }
}