import express from 'express';
import { body } from 'express-validator';
import {
  getAllCouples,
  createCouple,
  updateCouple,
  deleteCouple,
  regenerateCode,
  getAllSufganiot,
  createSufgania,
  updateSufgania,
  deleteSufgania,
  uploadSufganiaPhoto,
  getResults,
  getAllComments,
  openVoting,
  closeVoting,
  publishResults,
  unpublishResults,
  getSettings,
  setVotingEndTime,
  getActivities,
} from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import handleValidation from '../middleware/validation.js';

const router = express.Router();

// Apply admin authentication to all routes
router.use(verifyToken, isAdmin);

// ===== Couple Management =====
router.get('/couples', getAllCouples);

router.post(
  '/couples',
  [
    body('coupleName').notEmpty().trim().withMessage('Couple name is required'),
  ],
  handleValidation,
  createCouple
);

router.put(
  '/couples/:id',
  [
    body('coupleName').optional().notEmpty().trim().withMessage('Couple name cannot be empty'),
  ],
  handleValidation,
  updateCouple
);

router.delete('/couples/:id', deleteCouple);

router.post('/couples/:id/regenerate-code', regenerateCode);

// ===== Sufgania Management =====
router.get('/sufganiot', getAllSufganiot);

router.post(
  '/sufganiot',
  [
    body('name').notEmpty().trim().withMessage('Sufgania name is required'),
    body('coupleId').notEmpty().isMongoId().withMessage('Valid couple ID is required'),
  ],
  handleValidation,
  createSufgania
);

router.put(
  '/sufganiot/:id',
  [
    body('name').optional().notEmpty().trim().withMessage('Sufgania name cannot be empty'),
  ],
  handleValidation,
  updateSufgania
);

router.delete('/sufganiot/:id', deleteSufgania);

router.post('/sufganiot/:id/photo', upload.single('photo'), uploadSufganiaPhoto);

// ===== Results & Comments =====
router.get('/results', getResults);
router.get('/comments', getAllComments);

// ===== Settings & Control =====
router.get('/settings', getSettings);
router.post('/voting/open', openVoting);
router.post('/voting/close', closeVoting);
router.post('/voting/end-time', setVotingEndTime);
router.post('/results/publish', publishResults);
router.post('/results/unpublish', unpublishResults);

// ===== Activities =====
router.get('/activities', getActivities);

export default router;
