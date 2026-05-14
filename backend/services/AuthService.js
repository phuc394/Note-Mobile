import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connection from '../config/database.js';

// Register a new user
export async function register(username, email, password) {
  return new Promise((resolve, reject) => {
    // Check if user already exists
    connection.query(
      'SELECT * FROM users WHERE username = ? OR gmail = ?',
      [username, email],
      async (err, results) => {
        if (err) return reject(err);

        if (results.length > 0) {
          return reject(new Error('Username or email already exists'));
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Insert new user
        connection.query(
          'INSERT INTO users (username, gmail, password_hash) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          (err, results) => {
            if (err) return reject(err);
            resolve({
              id: results.insertId,
              username,
              email,
            });
          }
        );
      }
    );
  });
}

// Login user
export async function login(identifier, password) {
  return new Promise((resolve, reject) => {
    // Identifier can be username or email
    connection.query(
      'SELECT * FROM users WHERE username = ? OR gmail = ?',
      [identifier, identifier],
      async (err, results) => {
        if (err) return reject(err);

        if (results.length === 0) {
          return reject(new Error('Invalid username/email or password'));
        }

        const user = results[0];

        // Compare password
        const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

        if (!isPasswordValid) {
          return reject(new Error('Invalid username/email or password'));
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.gmail },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );

        resolve({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.gmail,
          },
        });
      }
    );
  });
}

// Get user by ID
export async function getUserById(userId) {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT id, username, gmail, full_name, created_at FROM users WHERE id = ?',
      [userId],
      (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) {
          return reject(new Error('User not found'));
        }
        resolve(results[0]);
      }
    );
  });
}

// Verify JWT token
export async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
}
