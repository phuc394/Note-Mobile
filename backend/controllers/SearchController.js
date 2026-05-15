const searchService = require("../services/SearchService");

const searchNotes = async (req, res) => {
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

module.exports = {
  searchNotes,
};
