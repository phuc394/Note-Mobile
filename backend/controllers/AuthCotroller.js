import * as AuthService from '../services/AuthService.js';

// POST /auth/register
export async function register(req, res) {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    // Validate input
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        message: 'Passwords do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const user = await AuthService.register(username, email, password);

    return res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Registration failed',
    });
  }
}

// POST /auth/login
export async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Please provide username/email and password',
      });
    }

    const result = await AuthService.login(identifier, password);

    return res.status(200).json({
      message: 'Login successful',
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message || 'Login failed',
    });
  }
}

// GET /auth/me
export async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await AuthService.getUserById(userId);

    return res.status(200).json({
      message: 'User profile retrieved successfully',
      user,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message || 'User not found',
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;
    const updatedUser = await AuthService.updateProfile(userId, username, email);

    return res.status(200).json({
      message: 'User profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message || 'User not found',
    });
  }
}

export async function logOut(req, res) {
  try {
    const result = await AuthService.logOut();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Logout failed',
    });
  }
}
