import express from 'express';
import { body } from 'express-validator';
import { adminLogin, coupleLogin, verifySession } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import handleValidation from '../middleware/validation.js';

const router = express.Router();

// Admin login
router.post(
  '/admin/login',
  [
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidation,
  adminLogin
);

// Couple login
router.post(
  '/couple/login',
  [
    body('loginCode')
      .notEmpty()
      .withMessage('Login code is required')
      .isLength({ min: 4, max: 10 })
      .withMessage('Invalid login code format'),
  ],
  handleValidation,
  coupleLogin
);

// Verify session
router.get('/verify', verifyToken, verifySession);

export default router;
