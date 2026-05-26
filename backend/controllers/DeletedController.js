import * as DeletedService from '../services/DeletedService.js';

function handleError(res, error, fallbackMessage = 'Loi Server') {
  return res.status(error.statusCode ?? 500).json({
    message: error.message || fallbackMessage,
  });
}

export async function getAllDeletedNotes(req, res) {
  try {
    const notes = await DeletedService.getAllDeletedNotes(req.user.id);
    return res.status(200).json(notes);
  } catch (error) {
    return handleError(res, error, 'Loi khi lay danh sach ghi chu da xoa');
  }
}

export async function getDeletedNote(req, res) {
  try {
    const { id } = req.params;
    const note = await DeletedService.getDeletedNote(id, req.user.id);
    return res.status(200).json(note);
  } catch (error) {
    return handleError(res, error, 'Loi khi lay chi tiet ghi chu da xoa');
  }
}

export async function searchDeletedNotes(req, res) {
  try {
    const { keyword } = req.query;

    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({
        message: 'Vui long nhap tu khoa tim kiem',
        data: [],
      });
    }

    const notes = await DeletedService.searchDeletedNotes(req.user.id, keyword);
    return res.status(200).json({
      message: 'Tim kiem ghi chu da xoa thanh cong',
      data: notes,
    });
  } catch (error) {
    return handleError(res, error, 'Loi khi tim kiem ghi chu da xoa');
  }
}

export async function RestoreNote(req, res) {
  try {
    const { id } = req.params;
    await DeletedService.RestoreNote(id, req.user.id);
    return res.status(200).json({ message: 'Da khoi phuc ghi chu' });
  } catch (error) {
    return handleError(res, error, 'Loi khi khoi phuc ghi chu');
  }
}

export async function DeleteOneDeleted(req, res) {
  try {
    const { id } = req.params;
    await DeletedService.DeleteOneDeleted(id, req.user.id);
    return res.status(200).json({ message: 'Da xoa vinh vien ghi chu' });
  } catch (error) {
    return handleError(res, error, 'Loi khi xoa ghi chu trong thung rac');
  }
}

export async function DeleteManyDeleted(req, res) {
  try {
    const { ids } = req.body;
    const result = await DeletedService.DeleteManyDeleted(ids, req.user.id);
    return res.status(200).json({
      message: 'Da xoa vinh vien cac ghi chu da chon',
      deleted_count: result.affectedRows,
    });
  } catch (error) {
    return handleError(res, error, 'Loi khi xoa nhieu ghi chu trong thung rac');
  }
}

export async function DeleteAllDeleted(req, res) {
  try {
    const result = await DeletedService.DeleteAllDeleted(req.user.id);
    return res.status(200).json({
      message: 'Da don sach thung rac',
      deleted_count: result.affectedRows,
    });
  } catch (error) {
    return handleError(res, error, 'Loi khi don sach thung rac');
  }
}
