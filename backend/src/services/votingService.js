import { Vote, Sufgania, Couple, Settings } from '../models/index.js';
import { ApiError } from '../utils/errorHandler.js';

/**
 * Check if voting is currently open
 * @returns {Promise<boolean>}
 */
export const isVotingOpen = async () => {
  const settings = await Settings.getInstance();
  return settings?.votingOpen || false;
};

/**
 * Check if a couple can vote for a specific sufgania
 * @param {string} coupleId - ID of the voting couple
 * @param {string} sufganiaId - ID of the sufgania
 * @returns {Promise<boolean>}
 */
export const canVote = async (coupleId, sufganiaId) => {
  const sufgania = await Sufgania.findById(sufganiaId);

  if (!sufgania) {
    throw new ApiError(404, 'Sufgania not found');
  }

  if (sufgania.coupleId.toString() === coupleId.toString()) {
    throw new ApiError(403, 'Cannot vote for your own sufgania');
  }

  return true;
};

/**
 * Submit or update rankings for a category
 * @param {string} coupleId - ID of the voting couple
 * @param {string} category - Category (taste, creativity, presentation)
 * @param {Array} rankings - Array of {sufganiaId, rank} objects
 * @returns {Promise<Array>} Created/updated votes
 */
export const submitCategoryRankings = async (coupleId, category, rankings) => {
  // Verify voting is open
  const votingOpen = await isVotingOpen();
  if (!votingOpen) {
    throw new ApiError(403, 'Voting is currently closed');
  }

  // Validate category
  const validCategories = ['taste', 'creativity', 'presentation'];
  if (!validCategories.includes(category)) {
    throw new ApiError(400, 'Invalid category');
  }

  // Validate rankings array
  if (!Array.isArray(rankings) || rankings.length === 0) {
    throw new ApiError(400, 'Rankings must be a non-empty array');
  }

  // Check for duplicate ranks
  const ranks = rankings.map(r => r.rank);
  if (new Set(ranks).size !== ranks.length) {
    throw new ApiError(400, 'Duplicate ranks are not allowed');
  }

  // Verify couple exists and get their sufgania
  const couple = await Couple.findById(coupleId).populate('sufgania');
  if (!couple) {
    throw new ApiError(404, 'Couple not found');
  }

  const coupleSufganiaId = couple.sufgania?._id;
  const votes = [];

  for (const ranking of rankings) {
    const { sufganiaId, rank } = ranking;

    // Check if trying to vote for own sufgania
    if (coupleSufganiaId && sufganiaId === coupleSufganiaId.toString()) {
      throw new ApiError(403, 'Cannot vote for your own sufgania');
    }

    // Verify sufgania exists
    const sufgania = await Sufgania.findById(sufganiaId);
    if (!sufgania) {
      throw new ApiError(404, `Sufgania ${sufganiaId} not found`);
    }

    // Create or update vote using findOneAndUpdate with upsert
    const vote = await Vote.findOneAndUpdate(
      { voterCoupleId: coupleId, sufganiaId, category },
      { rank },
      { upsert: true, new: true, runValidators: true }
    );

    votes.push(vote);
  }

  // Update couple's hasVoted flag
  couple.hasVoted = true;
  await couple.save();

  return votes;
};

/**
 * Get all sufganiot that a couple can vote for (excludes their own)
 * @param {string} coupleId - ID of the couple
 * @returns {Promise<Array>} Array of sufganiot
 */
export const getVotableSufganiot = async (coupleId) => {
  const couple = await Couple.findById(coupleId).populate('sufgania');

  if (!couple) {
    throw new ApiError(404, 'Couple not found');
  }

  const coupleSufganiaId = couple.sufgania?._id;

  console.log('🎯 Votable Sufganiot Query:', {
    coupleId,
    coupleName: couple.coupleName,
    coupleSufganiaId: coupleSufganiaId?.toString(),
    excludingOwn: !!coupleSufganiaId
  });

  // Build query to exclude couple's own sufgania
  const query = coupleSufganiaId ? { _id: { $ne: coupleSufganiaId } } : {};

  const sufganiot = await Sufgania.find(query)
    .populate('couple', '_id coupleName')
    .sort({ name: 1 });

  console.log('📦 Found sufganiot:', sufganiot.length, sufganiot.map(s => ({ id: s._id, name: s.name, coupleId: s.coupleId })));

  return sufganiot;
};

/**
 * Get a couple's votes
 * @param {string} coupleId - ID of the couple
 * @returns {Promise<Object>} Object with votes grouped by category
 */
export const getCoupleVotes = async (coupleId) => {
  const votes = await Vote.find({ voterCoupleId: coupleId })
    .populate({
      path: 'sufgania',
      populate: {
        path: 'couple',
        select: 'coupleName'
      }
    })
    .sort({ category: 1, rank: 1 });

  // Group by category
  const groupedVotes = {
    taste: [],
    creativity: [],
    presentation: [],
  };

  votes.forEach(vote => {
    groupedVotes[vote.category].push({
      sufganiaId: vote.sufganiaId,
      sufganiaName: vote.sufgania.name,
      coupleName: vote.sufgania.couple.coupleName,
      rank: vote.rank,
    });
  });

  return groupedVotes;
};

export default {
  isVotingOpen,
  canVote,
  submitCategoryRankings,
  getVotableSufganiot,
  getCoupleVotes,
};
