import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const {
  LIMITER,
  NODE_ENV,
  SHOW_DOCS,
  SERVER_URL,
  DB_SSL = false,
  DB_HOST,
  DB_COMPOSE_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASS,
  REDIS_PREFIX,
  TOKEN_SECRET,
  TOKEN_EXPIRY,
  SENDGRID_API_KEY,
  CORRECTION_URL,
} = process.env;

const DB_URL = process.env.DATABASE_URL || process.env.DB_URL;
const REDIS_URL = `redis://${process.env.REDIS_HOST}:${Number(process.env.REDIS_PORT)}`;
const SERVER_PORT = Number(process.env.SERVER_PORT || process.env.PORT);
const DB_LOGGING_LEVEL = process.env.DB_LOGGING_LEVEL?.split(',');

export {
  LIMITER,
  NODE_ENV,
  SHOW_DOCS,
  SERVER_URL,
  SERVER_PORT,
  DB_SSL,
  DB_URL,
  DB_HOST,
  DB_COMPOSE_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_LOGGING_LEVEL,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASS,
  REDIS_PREFIX,
  REDIS_URL,
  TOKEN_SECRET,
  TOKEN_EXPIRY,
  SENDGRID_API_KEY,
  CORRECTION_URL,
};
