import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load backend/.env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME || 'agentverse',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  },
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    env: process.env.NODE_ENV || 'development',
  },
  // Individual service ports
  ports: {
    auth:         parseInt(process.env.AUTH_PORT         || '5001', 10),
    club:         parseInt(process.env.CLUB_PORT         || '5002', 10),
    application:  parseInt(process.env.APPLICATION_PORT  || '5003', 10),
    notification: parseInt(process.env.NOTIFICATION_PORT || '5004', 10),
    activity:     parseInt(process.env.ACTIVITY_PORT     || '5005', 10),
    analytics:    parseInt(process.env.ANALYTICS_PORT    || '5006', 10),
  },
  // Shared JWT secret — read once, used by all services
  jwtSecret: process.env.JWT_SECRET || 'agentverse_secret_key_2026',
};
