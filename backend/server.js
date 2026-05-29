import http from 'http';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { socketCorsOrigin } from './config/cors.js';
import { validateEnv } from './config/env.js';
import app from './app.js';
import { setSocketServer } from './socket.js';
import { getSharedNoteAccess } from './services/SharedService.js';

validateEnv();

const port = Number(process.env.PORT ?? 3000);
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
      await getSharedNoteAccess(noteId, socket.user.id);
      socket.join(`note:${noteId}`);
      callback?.({ ok: true });
    } catch (error) {
      callback?.({ ok: false, message: error.message });
    }
  });

  socket.on('shared:leave', ({ noteId }) => {
    socket.leave(`note:${noteId}`);
  });
});

setSocketServer(io);

server.listen(port, () => {
  console.log(`Backend is listening on port ${port}`);
});
