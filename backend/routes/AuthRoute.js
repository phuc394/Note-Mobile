import express from 'express';
import * as AuthController from '../controllers/AuthCotroller.js';
import authMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', (req, res) => AuthController.register(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));
router.post('/logout', authMiddleware, (req, res) => AuthController.logOut(req, res));

// Protected routes (require authentication)
router.get('/me', authMiddleware, (req, res) => AuthController.getProfile(req, res));
router.put('/me', authMiddleware, (req, res) => AuthController.updateProfile(req, res));

export default router;
