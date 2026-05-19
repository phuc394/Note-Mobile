import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connection from '../config/database.js';

const db = connection.promise();

// Register a new user
export async function register(username, email, password) {
  // Check if user already exists
  const [existingUsers] = await db.query(
    'SELECT * FROM users WHERE username = ? OR gmail = ?',
    [username, email]
  );

  if (existingUsers.length > 0) {
    throw new Error('Username or email already exists');
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 10);

  // Insert new user
  const [result] = await db.query(
    'INSERT INTO users (username, gmail, password_hash) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  return {
    id: result.insertId,
    username,
    email,
  };
}

// Login user
export async function login(identifier, password) {
  // Identifier can be username or email
  const [results] = await db.query(
    'SELECT * FROM users WHERE username = ? OR gmail = ?',
    [identifier, identifier]
  );

  if (results.length === 0) {
    throw new Error('Invalid username/email or password');
  }

  const user = results[0];

  // Compare password
  const isPasswordValid = await bcryptjs.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('Invalid username/email or password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.gmail },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.gmail,
    },
  };
}

export async function logOut() {
  // In a stateless JWT architecture, the server doesn't maintain session state.
  // Logout is primarily handled on the client side by discarding the token.
  // This function returns a success message to confirm the logout process 
  // can proceed on the client.
  return { success: true, message: 'Logged out successfully' };
}

// Get user by ID
export async function getUserById(userId) {
  const [results] = await db.query(
    'SELECT id, username, email, created_at FROM users WHERE id = ?',
    [userId]
  );

  if (results.length === 0) {
    throw new Error('User not found');
  }
  return results[0];
}

export async function updateUser(userId, username, email) {
  const [results] = await db.query(
    'UPDATE users SET username = ?, email = ? WHERE id = ?',
    [username, email, userId]
  );
  return results;
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
