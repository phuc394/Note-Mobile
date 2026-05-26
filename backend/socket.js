let ioInstance;

export function setSocketServer(io) {
  ioInstance = io;
}

export function getSocketServer() {
  return ioInstance;
}

export function emitSharedNoteUpdated(noteId, payload) {
  if (!ioInstance) return;
  ioInstance.to(`note:${noteId}`).emit('shared:note-updated', payload);
}
