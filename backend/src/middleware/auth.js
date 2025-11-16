import jwt from 'jsonwebtoken';
import config from '../config/environment.js';
import { ApiError } from '../utils/errorHandler.js';

/**
 * Verify JWT token middleware
 */
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'No token provided');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

/**
 * Check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }
  next();
};

/**
 * Check if user is a couple
 */
export const isCouple = (req, res, next) => {
  if (!req.user || req.user.role !== 'couple') {
    throw new ApiError(403, 'Couple access required');
  }
  next();
};

export default {
  verifyToken,
  isAdmin,
  isCouple,
};
