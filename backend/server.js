import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { socketCorsOrigin } from './config/cors.js';
import { validateEnv } from './config/env.js';
import app from './app.js';
import { setSocketServer } from './socket.js';
import { GetNote } from './services/NoteService.js';

validateEnv();

const port = Number(process.env.PORT ?? 3000);
const collaborationColors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#0891b2', '#ea580c'];

function getCollaborationColor(value = '') {
  const text = String(value).toLowerCase();
  const hash = [...text].reduce((total, char) => total + char.charCodeAt(0), 0);
  return collaborationColors[hash % collaborationColors.length];
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: socketCorsOrigin,
    methods: ['GET', 'POST'],
  },
});

io.use((socket, next) => {
  try {
    const authToken = socket.handshake.auth?.token;
    const bearerToken = socket.handshake.headers.authorization;
    const token = authToken || (bearerToken?.startsWith('Bearer ') ? bearerToken.slice(7) : bearerToken);

    if (!token) {
      return next(new Error('Authentication token is missing'));
    }

    socket.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  socket.on('shared:join', async ({ noteId }, callback) => {
    try {
      await GetNote(noteId, socket.user.id);
      socket.join(`note:${noteId}`);
      callback?.({ ok: true });
    } catch (error) {
      callback?.({ ok: false, message: error.message });
    }
  });

  socket.on('shared:leave', ({ noteId }) => {
    socket.leave(`note:${noteId}`);
  });

  socket.on('shared:note-draft', async ({ noteId, title, content }, callback) => {
    try {
      const note = await GetNote(noteId, socket.user.id);
      if (!note.is_owner && !note.shared_can_edit) {
        callback?.({ ok: false, message: 'You only have permission to view this note' });
        return;
      }

      socket.to(`note:${noteId}`).emit('shared:note-draft', {
        note_id: Number(noteId),
        editor_id: socket.user.id,
        editor: {
          id: socket.user.id,
          username: socket.user.username,
          email: socket.user.email,
          color: getCollaborationColor(socket.user.email ?? socket.user.username ?? socket.user.id),
        },
        title: note.is_owner ? title : undefined,
        content: content ?? '',
      });
      callback?.({ ok: true });
    } catch (error) {
      callback?.({ ok: false, message: error.message });
    }
  });
});

setSocketServer(io);

server.listen(port, () => {
  console.log(`Backend is listening on port ${port}`);
});
