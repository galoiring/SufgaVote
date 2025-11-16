import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Couple } from '../models/index.js';
import config from '../config/environment.js';
import { ApiError, asyncHandler } from '../utils/errorHandler.js';

/**
 * Admin login
 */
export const adminLogin = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, 'Password is required');
  }

  // Compare with admin password (in production, use hashed password)
  if (password !== config.admin.password) {
    throw new ApiError(401, 'Invalid password');
  }

  // Generate JWT token
  const token = jwt.sign(
    { role: 'admin' },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  res.json({
    success: true,
    token,
    user: { role: 'admin' },
  });
});

/**
 * Couple login with code
 */
export const coupleLogin = asyncHandler(async (req, res) => {
  const { loginCode } = req.body;

  console.log('Couple login attempt with code:', loginCode);

  if (!loginCode) {
    throw new ApiError(400, 'Login code is required');
  }

  const upperCode = loginCode.toUpperCase().trim();
  console.log('Searching for code:', upperCode);

  // Find couple by login code
  const couple = await Couple.findOne({
    loginCode: upperCode,
  });

  console.log('Couple found:', couple ? 'Yes' : 'No');
  if (couple) {
    console.log('Couple details:', {
      id: couple._id,
      name: couple.coupleName,
      code: couple.loginCode,
    });
  }

  if (!couple) {
    // Debug: Check what codes exist
    const allCouples = await Couple.find().select('loginCode coupleName');
    console.log('❌ Couple not found. Available codes in database:');
    allCouples.forEach(c => {
      console.log(`  - Code: "${c.loginCode}" (length: ${c.loginCode.length}), Name: ${c.coupleName}`);
    });
    console.log(`  Searched for: "${upperCode}" (length: ${upperCode.length})`);
    throw new ApiError(401, `Invalid login code. Code "${upperCode}" not found.`);
  }

  // Generate JWT token
  // Use _id.toString() to ensure we have a string ID
  const coupleIdString = couple._id.toString();
  
  const token = jwt.sign(
    {
      role: 'couple',
      coupleId: coupleIdString,
      coupleName: couple.coupleName,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  res.json({
    success: true,
    token,
    user: {
      role: 'couple',
      id: coupleIdString,
      coupleName: couple.coupleName,
      hasVoted: couple.hasVoted,
    },
  });
});

/**
 * Verify current session
 */
export const verifySession = asyncHandler(async (req, res) => {
  // User data is already attached by verifyToken middleware
  res.json({
    success: true,
    user: req.user,
  });
});

export default {
  adminLogin,
  coupleLogin,
  verifySession,
};
