import { validationResult } from 'express-validator';
import { ApiError } from '../utils/errorHandler.js';

/**
 * Middleware to handle validation errors
 */
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    console.log('❌ Validation Errors:', {
      path: req.path,
      body: req.body,
      errors: formattedErrors
    });

    throw new ApiError(400, 'Validation failed', formattedErrors);
  }

  next();
};

export default handleValidation;
