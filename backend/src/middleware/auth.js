import jwt from 'jsonwebtoken';
import { getPool } from '../config/db.js';
import { config } from '../config/env.js';

const JWT_SECRET = config.jwtSecret;

/**
 * Generates JWT token for user authentication
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Authentication middleware: Verifies JWT token or dev headers
 */
export async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Support fallback X-User-Id header for testing
    const fallbackUserId = req.headers['x-user-id'];

    if (!token && !fallbackUserId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthenticated. Authorization token required.',
      });
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        return next();
      } catch (jwtErr) {
        // Continue to fallback check or return error
      }
    }

    if (fallbackUserId) {
      const pool = getPool();
      const [users] = await pool.query(
        'SELECT id, full_name, email, role, phone_number, department, year_of_study FROM users WHERE id = ?',
        [fallbackUserId]
      );

      if (users.length > 0) {
        req.user = users[0];
        return next();
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authentication check failed: ' + error.message,
    });
  }
}

/**
 * Role-based authorization middleware
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthenticated user.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Action requires role: ${allowedRoles.join(' or ')}. Yours: ${req.user.role}`,
      });
    }

    next();
  };
}
