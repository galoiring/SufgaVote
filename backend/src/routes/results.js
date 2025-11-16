import express from 'express';
import { getPublishedResults, getGallery } from '../controllers/resultsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get published results (requires authentication)
router.get('/', verifyToken, getPublishedResults);

// Get photo gallery (public or authenticated)
router.get('/gallery', getGallery);

export default router;
