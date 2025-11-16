import express from 'express';
import { body } from 'express-validator';
import {
  getVotingStatus,
  getSufganiot,
  getMyVotes,
  submitRankings,
  addComment,
  getSufganiaComments,
} from '../controllers/votingController.js';
import { verifyToken, isCouple } from '../middleware/auth.js';
import handleValidation from '../middleware/validation.js';

const router = express.Router();

// Voting status (public)
router.get('/status', getVotingStatus);

// Apply couple authentication to remaining routes
router.use(verifyToken, isCouple);

// Get sufganiot available for voting
router.get('/sufganiot', getSufganiot);

// Get couple's votes
router.get('/my-votes', getMyVotes);

// Submit rankings for a category
router.post(
  '/rankings',
  [
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['taste', 'creativity', 'presentation'])
      .withMessage('Invalid category'),
    body('rankings')
      .isArray({ min: 1 })
      .withMessage('Rankings must be a non-empty array'),
    body('rankings.*.sufganiaId')
      .notEmpty()
      .isUUID()
      .withMessage('Valid sufgania ID is required'),
    body('rankings.*.rank')
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage('Rank must be a positive integer'),
  ],
  handleValidation,
  submitRankings
);

// Add or update comment
router.post(
  '/comments',
  [
    body('sufganiaId').notEmpty().isUUID().withMessage('Valid sufgania ID is required'),
    body('commentText')
      .notEmpty()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Comment must be between 1 and 500 characters'),
  ],
  handleValidation,
  addComment
);

// Get comments for a sufgania
router.get('/sufganiot/:sufganiaId/comments', getSufganiaComments);

export default router;
