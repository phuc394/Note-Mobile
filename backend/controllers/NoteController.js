import * as NoteService from '../services/NoteService.js';

export async function GetNote(req, res) {
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

export async function GetAllNotes(req, res) {
    try {
        const { user_id } = req.params; // Lấy user_id từ URL
        const notes = await NoteService.GetAllNotes(user_id);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách ghi chú", error });
    }
}

export async function TogglePinNote(req, res) {
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

export async function searchNotes(req, res) {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({
        message: "Vui lòng nhập từ khóa tìm kiếm",
        data: [],
      });
    }
    const userId = req.user.id;

    const notes = await searchService.searchNotes(userId, keyword);

    return res.status(200).json({
      message: "Tìm kiếm ghi chú thành công",
      data: notes,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi tìm kiếm ghi chú",
      error: error.message,
    });
  }
};

export async function DeleteNote(req, res) {
    try {
        const { id } = req.params;
        const notes = await NoteService.DeleteNote(id);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa ghi chú", error });
    }
}

export async function CreateNote(req, res) {
    try {
        const { user_id } = req.body; // Lấy user_id từ body
        const { title, content } = req.body; 
        const notes = await NoteService.CreateNote(title, content, user_id);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo ghi chú", error });
    }
}

export async function EditNote(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const notes = await NoteService.EditNote(id, title, content);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật ghi chú", error });
    }
}
