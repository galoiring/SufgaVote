import { Settings, Sufgania, Couple } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/errorHandler.js';
import { calculateRankings } from '../services/rankingService.js';

/**
 * Get published results (for participants)
 */
export const getPublishedResults = asyncHandler(async (req, res) => {
  // Check if results are published
  const settings = await Settings.findOne();

  if (!settings || !settings.resultsPublished) {
    throw new ApiError(403, 'Results have not been published yet');
  }

  const results = await calculateRankings();

  res.json({
    success: true,
    data: results,
  });
});

/**
 * Get photo gallery
 */
export const getGallery = asyncHandler(async (req, res) => {
  const sufganiot = await Sufgania.find()
    .populate('couple', 'coupleName')
    .sort({ name: 1 });

  const gallery = sufganiot.map(s => ({
    id: s._id,
    name: s.name,
    photoUrl: s.photoUrl,
    coupleName: s.couple?.coupleName || '',
  }));

  res.json({
    success: true,
    data: gallery,
  });
});

export default {
  getPublishedResults,
  getGallery,
};
