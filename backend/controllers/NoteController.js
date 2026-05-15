const NoteService = require('../services/NoteService');

async function GetNote(req, res) {
    try {
        const { id } = req.params; // Lấy id từ đường dẫn /get/:id
        const note = await NoteService.GetNote(id);
        
        if (note) {
            res.status(200).json(note);
        } else {
            res.status(404).json({ message: "Không tìm thấy ghi chú này" });
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server", error });
    }
}

async function GetAllNotes(req, res) {
    try {
        const { user_id } = req.params; // Lấy user_id từ URL
        const notes = await NoteService.GetAllNotes(user_id);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách ghi chú", error });
    }
}

async function TogglePinNote(req, res) {
    try {
        const { id } = req.params;
        const { is_pinned } = req.body; // Frontend gửi lên 1 hoặc 0
        
        await NoteService.TogglePinNote(id, is_pinned);
        res.status(200).json({ 
            message: is_pinned ? "Đã ghim ghi chú" : "Đã bỏ ghim ghi chú" 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái ghim", error });
    }
}

async function SearchNotes(req, res) {
    const { query } = req.params;
    const notes = await NoteService.SearchNotes(query);
    res.json(notes);
}

async function DeleteNote(req, res) {
    const { id } = req.params;
    const notes = await NoteService.DeleteNote(id);
    res.json(notes);
}

async function CreateNote(req, res) {
    const { title, content, user_id } = req.body; 
    const notes = await NoteService.CreateNote(title, content, user_id);
    res.json(notes);
}

async function EditNote(req, res) {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const notes = await NoteService.EditNote(id, title, content);
    res.json(notes);
}

module.exports = {
    CreateNote,
    EditNote,
    SearchNotes,
    DeleteNote,
    GetNote,
    GetAllNotes,
    TogglePinNote
};