import { Comment, Sufgania } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/errorHandler.js';
import {
  getVotableSufganiot,
  getCoupleVotes,
  submitCategoryRankings,
  isVotingOpen,
} from '../services/votingService.js';

/**
 * Get voting status
 */
export const getVotingStatus = asyncHandler(async (req, res) => {
  const votingOpen = await isVotingOpen();

  res.json({
    success: true,
    data: {
      votingOpen,
    },
  });
});

/**
 * Get all sufganiot available for voting (excluding couple's own)
 */
export const getSufganiot = asyncHandler(async (req, res) => {
  const { coupleId } = req.user;

  const sufganiot = await getVotableSufganiot(coupleId);

  res.json({
    success: true,
    data: sufganiot,
  });
});

/**
 * Get current couple's votes
 */
export const getMyVotes = asyncHandler(async (req, res) => {
  const { coupleId } = req.user;

  const votes = await getCoupleVotes(coupleId);

  res.json({
    success: true,
    data: votes,
  });
});

/**
 * Submit rankings for a category
 */
export const submitRankings = asyncHandler(async (req, res) => {
  const { coupleId } = req.user;
  const { category, rankings } = req.body;

  if (!category || !rankings) {
    throw new ApiError(400, 'Category and rankings are required');
  }

  const votes = await submitCategoryRankings(coupleId, category, rankings);

  res.json({
    success: true,
    message: `Rankings submitted for ${category}`,
    data: votes,
  });
});

/**
 * Add or update a comment
 */
export const addComment = asyncHandler(async (req, res) => {
  const { coupleId } = req.user;
  const { sufganiaId, commentText } = req.body;

  if (!sufganiaId || !commentText) {
    throw new ApiError(400, 'Sufgania ID and comment text are required');
  }

  // Verify voting is open
  const votingOpen = await isVotingOpen();
  if (!votingOpen) {
    throw new ApiError(403, 'Voting is currently closed');
  }

  // Verify sufgania exists
  const sufgania = await Sufgania.findById(sufganiaId);
  if (!sufgania) {
    throw new ApiError(404, 'Sufgania not found');
  }

  // Check if commenting on own sufgania
  if (sufgania.coupleId.toString() === coupleId.toString()) {
    throw new ApiError(403, 'Cannot comment on your own sufgania');
  }

  // Create or update comment (upsert)
  const comment = await Comment.findOneAndUpdate(
    {
      voterCoupleId: coupleId,
      sufganiaId,
    },
    {
      voterCoupleId: coupleId,
      sufganiaId,
      commentText,
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );
  
  const created = !comment.createdAt || comment.createdAt.getTime() === comment.updatedAt.getTime();

  res.json({
    success: true,
    message: created ? 'Comment added' : 'Comment updated',
    data: comment,
  });
});

/**
 * Get comments for a sufgania
 */
export const getSufganiaComments = asyncHandler(async (req, res) => {
  const { sufganiaId } = req.params;

  const comments = await Comment.find({ sufganiaId })
    .select('commentText createdAt')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: comments,
  });
});

export default {
  getVotingStatus,
  getSufganiot,
  getMyVotes,
  submitRankings,
  addComment,
  getSufganiaComments,
};
