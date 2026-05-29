import { getEnvList, isProduction } from './env.js';

const configuredOrigins = [
  ...getEnvList('CLIENT_ORIGIN'),
  ...getEnvList('FRONTEND_URL'),
];

const allowAllOrigins = !isProduction && configuredOrigins.length === 0;

function isOriginAllowed(origin) {
  if (!origin) {
    return true;
  }

  if (allowAllOrigins) {
    return true;
  }

  return configuredOrigins.includes(origin);
}

export function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowed = isOriginAllowed(origin);

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin ?? '*');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(allowed ? 204 : 403);
  }

  if (!allowed) {
    return res.status(403).json({
      message: 'Origin is not allowed by CORS',
    });
  }

  return next();
}

export function socketCorsOrigin(origin, callback) {
  if (isOriginAllowed(origin)) {
    return callback(null, true);
  }

  return callback(new Error('Origin is not allowed by CORS'));
}
