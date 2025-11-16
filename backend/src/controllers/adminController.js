import { Couple, Sufgania, Vote, Comment, Settings, Activity } from '../models/index.js';
import { generateUniqueCode } from '../utils/codeGenerator.js';
import { ApiError, asyncHandler } from '../utils/errorHandler.js';
import { calculateRankings } from '../services/rankingService.js';
import { getRecentActivities, logActivity } from '../services/activityService.js';
import path from 'path';
import fs from 'fs/promises';

// ===== Couple Management =====

/**
 * Get all couples
 */
export const getAllCouples = asyncHandler(async (req, res) => {
  const couples = await Couple.find()
    .populate('sufgania', '_id name photoUrl')
    .sort({ coupleName: 1 });

  res.json({
    success: true,
    data: couples,
  });
});

/**
 * Create a new couple
 */
export const createCouple = asyncHandler(async (req, res) => {
  const { coupleName } = req.body;

  if (!coupleName) {
    throw new ApiError(400, 'Couple name is required');
  }

  // Get all existing codes
  const existingCouples = await Couple.find().select('loginCode');
  const existingCodes = new Set(existingCouples.map(c => c.loginCode));

  // Generate unique code
  const loginCode = generateUniqueCode(existingCodes);

  const couple = await Couple.create({
    coupleName,
    loginCode,
  });

  // Log activity
  await logActivity(
    'couple_created',
    'Admin',
    `created couple "${coupleName}"`,
    { coupleId: couple._id }
  );

  res.status(201).json({
    success: true,
    data: couple,
  });
});

/**
 * Update a couple
 */
export const updateCouple = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { coupleName } = req.body;

  const couple = await Couple.findById(id);
  if (!couple) {
    throw new ApiError(404, 'Couple not found');
  }

  if (coupleName) {
    couple.coupleName = coupleName;
  }

  await couple.save();

  res.json({
    success: true,
    data: couple,
  });
});

/**
 * Delete a couple
 */
export const deleteCouple = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const couple = await Couple.findById(id);
  if (!couple) {
    throw new ApiError(404, 'Couple not found');
  }

  await couple.deleteOne();

  res.json({
    success: true,
    message: 'Couple deleted successfully',
  });
});

/**
 * Regenerate login code for a couple
 */
export const regenerateCode = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const couple = await Couple.findById(id);
  if (!couple) {
    throw new ApiError(404, 'Couple not found');
  }

  // Get all existing codes
  const existingCouples = await Couple.find().select('loginCode');
  const existingCodes = new Set(existingCouples.map(c => c.loginCode));

  // Generate new unique code
  const newCode = generateUniqueCode(existingCodes);
  couple.loginCode = newCode;
  await couple.save();

  res.json({
    success: true,
    data: couple,
  });
});

// ===== Sufgania Management =====

/**
 * Get all sufganiot
 */
export const getAllSufganiot = asyncHandler(async (req, res) => {
  const sufganiot = await Sufgania.find()
    .populate('couple', '_id coupleName')
    .sort({ name: 1 });

  res.json({
    success: true,
    data: sufganiot,
  });
});

/**
 * Create a new sufgania
 */
export const createSufgania = asyncHandler(async (req, res) => {
  console.log('🍩 Create Sufgania Request:', {
    body: req.body,
    name: req.body.name,
    coupleId: req.body.coupleId
  });

  const { name, coupleId } = req.body;

  if (!name || !coupleId) {
    console.log('❌ Validation failed:', { name, coupleId });
    throw new ApiError(400, 'Name and couple ID are required');
  }

  // Verify couple exists
  const couple = await Couple.findById(coupleId);
  if (!couple) {
    throw new ApiError(404, 'Couple not found');
  }

  // Check if couple already has a sufgania
  const existingSufgania = await Sufgania.findOne({ coupleId });
  if (existingSufgania) {
    throw new ApiError(409, 'This couple already has a sufgania');
  }

  const sufgania = await Sufgania.create({
    name,
    coupleId,
  });

  // Reload with couple data
  await sufgania.populate('couple', '_id coupleName');

  // Log activity
  await logActivity(
    'sufgania_created',
    'Admin',
    `created sufgania "${name}" for ${couple.coupleName}`,
    { sufganiaId: sufgania._id, coupleId }
  );

  res.status(201).json({
    success: true,
    data: sufgania,
  });
});

/**
 * Update a sufgania
 */
export const updateSufgania = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const sufgania = await Sufgania.findById(id);
  if (!sufgania) {
    throw new ApiError(404, 'Sufgania not found');
  }

  if (name) {
    sufgania.name = name;
  }

  await sufgania.save();

  // Reload with couple data
  await sufgania.populate('couple', '_id coupleName');

  res.json({
    success: true,
    data: sufgania,
  });
});

/**
 * Delete a sufgania
 */
export const deleteSufgania = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sufgania = await Sufgania.findById(id);
  if (!sufgania) {
    throw new ApiError(404, 'Sufgania not found');
  }

  // Delete photo file if exists
  if (sufgania.photoUrl) {
    try {
      const filePath = path.join(process.cwd(), sufgania.photoUrl);
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting photo file:', error);
    }
  }

  await sufgania.deleteOne();

  res.json({
    success: true,
    message: 'Sufgania deleted successfully',
  });
});

/**
 * Upload photo for a sufgania
 */
export const uploadSufganiaPhoto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    throw new ApiError(400, 'Photo file is required');
  }

  const sufgania = await Sufgania.findById(id);
  if (!sufgania) {
    // Delete uploaded file
    await fs.unlink(req.file.path);
    throw new ApiError(404, 'Sufgania not found');
  }

  // Delete old photo if exists
  if (sufgania.photoUrl) {
    try {
      const oldFilePath = path.join(process.cwd(), sufgania.photoUrl);
      await fs.unlink(oldFilePath);
    } catch (error) {
      console.error('Error deleting old photo:', error);
    }
  }

  // Update photo URL (store relative path)
  sufgania.photoUrl = `/uploads/${req.file.filename}`;
  await sufgania.save();

  // Reload with couple data
  await sufgania.populate('couple', '_id coupleName');

  // Log activity
  await logActivity(
    'photo_uploaded',
    'Admin',
    `uploaded photo for sufgania "${sufgania.name}"`,
    { sufganiaId: sufgania._id }
  );

  res.json({
    success: true,
    data: sufgania,
  });
});

// ===== Results & Settings =====

/**
 * Get all results with rankings
 */
export const getResults = asyncHandler(async (req, res) => {
  const results = await calculateRankings();

  // Get voting statistics
  const totalCouples = await Couple.countDocuments();
  const votedCouples = await Couple.countDocuments({ hasVoted: true });

  res.json({
    success: true,
    data: {
      rankings: results,
      statistics: {
        totalCouples,
        votedCouples,
        votingPercentage: totalCouples > 0 ? ((votedCouples / totalCouples) * 100).toFixed(1) : 0,
      },
    },
  });
});

/**
 * Get all comments
 */
export const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find()
    .populate('voter', 'coupleName')
    .populate({
      path: 'sufgania',
      select: 'name',
      populate: {
        path: 'couple',
        select: 'coupleName'
      }
    })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: comments,
  });
});

/**
 * Get or create settings
 */
const getOrCreateSettings = async () => {
  return await Settings.getInstance();
};

/**
 * Open voting
 */
export const openVoting = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  settings.votingOpen = true;
  await settings.save();

  // Log activity
  await logActivity(
    'voting_opened',
    'Admin',
    'opened voting'
  );

  res.json({
    success: true,
    message: 'Voting opened',
    data: settings,
  });
});

/**
 * Close voting
 */
export const closeVoting = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  settings.votingOpen = false;
  await settings.save();

  // Log activity
  await logActivity(
    'voting_closed',
    'Admin',
    'closed voting'
  );

  res.json({
    success: true,
    message: 'Voting closed',
    data: settings,
  });
});

/**
 * Publish results
 */
export const publishResults = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  settings.resultsPublished = true;
  await settings.save();

  // Log activity
  await logActivity(
    'results_published',
    'Admin',
    'published results'
  );

  res.json({
    success: true,
    message: 'Results published',
    data: settings,
  });
});

/**
 * Unpublish results
 */
export const unpublishResults = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  settings.resultsPublished = false;
  await settings.save();

  res.json({
    success: true,
    message: 'Results unpublished',
    data: settings,
  });
});

/**
 * Get current settings
 */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  res.json({
    success: true,
    data: settings,
  });
});

/**
 * Set voting end time
 */
export const setVotingEndTime = asyncHandler(async (req, res) => {
  const { votingEndsAt } = req.body;

  if (!votingEndsAt) {
    throw new ApiError(400, 'Voting end time is required');
  }

  const settings = await getOrCreateSettings();
  settings.votingEndsAt = new Date(votingEndsAt);
  await settings.save();

  res.json({
    success: true,
    message: 'Voting end time set',
    data: settings,
  });
});

/**
 * Get recent activities
 */
export const getActivities = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const activities = await getRecentActivities(limit);

  res.json({
    success: true,
    data: activities,
  });
});

export default {
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
};
