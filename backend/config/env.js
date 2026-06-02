import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const envPath = fileURLToPath(new URL('../.env', import.meta.url));

dotenv.config({ path: envPath, quiet: true });

export const isProduction = process.env.NODE_ENV === 'production';

const LOCAL_DEFAULT_ENV = {
  NODE_ENV: 'development',
  PORT: '3000',
  DB_HOST: '127.0.0.1',
  DB_PORT: '3306',
  DB_USER: 'root',
  DB_PASSWORD: '',
  DB_NAME: 'note_mobile_db',
  DB_SSL: 'false',
  DB_SSL_REJECT_UNAUTHORIZED: 'true',
  DB_INSECURE_AUTH: 'false',
  JWT_SECRET: 'note-mobile-local-secret',
  JWT_EXPIRE: '7d',
  FRONTEND_URL: 'http://localhost:8081',
};

const PRODUCTION_REQUIRED_ENV = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
];

function applyLocalDefaults() {
  if (isProduction) {
    return;
  }

  for (const [name, value] of Object.entries(LOCAL_DEFAULT_ENV)) {
    if (process.env[name] === undefined) {
      process.env[name] = value;
    }
  }
}

applyLocalDefaults();

export function getEnvList(name) {
  return (process.env[name] ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export function validateEnv(requiredEnv = isProduction ? PRODUCTION_REQUIRED_ENV : []) {
  const missing = requiredEnv.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Set them in backend/.env before starting the backend.',
    );
  }

  if (!process.env.JWT_EXPIRE) {
    process.env.JWT_EXPIRE = '7d';
  }
}
