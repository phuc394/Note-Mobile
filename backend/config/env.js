import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const DEFAULT_REQUIRED_ENV = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
];

export const isProduction = process.env.NODE_ENV === 'production';

export function getEnvList(name) {
  return (process.env[name] ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export function validateEnv(requiredEnv = DEFAULT_REQUIRED_ENV) {
  const missing = requiredEnv.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (!process.env.JWT_EXPIRE) {
    process.env.JWT_EXPIRE = '7d';
  }
}
