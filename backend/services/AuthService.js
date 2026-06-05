import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connection from '../config/database.js';

const db = connection.promise();

// Register a new user
export async function register(username, email, password) {
  // Check if user already exists
  const [existingUsers] = await db.query(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, email]
  );

  if (existingUsers.length > 0) {
    throw new Error('Username or email already exists');
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 10);

  // Insert new user
  const [result] = await db.query(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
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
    'SELECT * FROM users WHERE username = ? OR email = ?',
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
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  await db.query(
    "UPDATE users SET is_logged_in = 'yes', logged_in_time = CURRENT_TIMESTAMP WHERE id = ?",
    [user.id]
  );
  const updatedUser = await getUserById(user.id);

  return {
    token,
    user: updatedUser,
  };
}

export async function logOut(userId) {
  await db.query(
    "UPDATE users SET is_logged_in = 'no', logged_out_time = CURRENT_TIMESTAMP WHERE id = ?",
    [userId]
  );

  return { success: true, message: 'Logged out successfully' };
}

// Get user by ID
export async function getUserById(userId) {
  const [results] = await db.query(
    `
      SELECT
        id,
        username,
        email,
        is_logged_in,
        avatar_url,
        logged_in_time,
        logged_out_time,
        created_at
      FROM users
      WHERE id = ?
    `,
    [userId]
  );

  if (results.length === 0) {
    throw new Error('User not found');
  }
  return results[0];
}

export async function updateProfile(userId, username, email, avatarUrl) {
  const currentUser = await getUserById(userId);
  const nextUsername = username?.trim() || currentUser.username;
  const nextEmail = email?.trim() || currentUser.email;
  const nextAvatarUrl = avatarUrl === undefined ? currentUser.avatar_url : avatarUrl;

  const [existingUsers] = await db.query(
    'SELECT id FROM users WHERE (username = ? OR email = ?) AND id <> ?',
    [nextUsername, nextEmail, userId]
  );

  if (existingUsers.length > 0) {
    throw new Error('Username or email already exists');
  }

  await db.query(
    'UPDATE users SET username = ?, email = ?, avatar_url = ? WHERE id = ?',
    [nextUsername, nextEmail, nextAvatarUrl, userId]
  );

  return getUserById(userId);
}

export async function updateUser(userId, username, email, avatarUrl) {
  return updateProfile(userId, username, email, avatarUrl);
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
