import './config/env.js';
import express from 'express';
import { corsMiddleware } from './config/cors.js';
import AuthRoute from './routes/AuthRoute.js';
import DeletedRoute from './routes/DeletedRoute.js';
import NoteRoute from './routes/NoteRoute.js';
import SharedRoute from './routes/SharedRoute.js';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.set('query parser', 'simple');

app.use(corsMiddleware);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '20kb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    name: 'note-mobile-api',
    status: 'ok',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/notes', NoteRoute);
app.use('/api/v1/deleted', DeletedRoute);
app.use('/api/v1/shared', SharedRoute);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode ?? 500;
  return res.status(statusCode).json({
    message: statusCode === 500 ? 'Internal server error' : error.message,
  });
});

export default app;
