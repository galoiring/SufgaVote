import { Sufgania, Vote, Couple, Comment } from '../models/index.js';

/**
 * Calculate scores and rankings for all sufganiot
 * @returns {Promise<Array>} Array of sufganiot with scores and rankings
 */
export const calculateRankings = async () => {
  const sufganiot = await Sufgania.find()
    .populate('couple', '_id coupleName')
    .lean();

  // Get all votes
  const votes = await Vote.find().lean();

  // Get all comments
  const comments = await Comment.find().lean();

  // Get total number of sufganiot for points calculation
  const totalSufganiot = sufganiot.length;

  // Calculate scores for each sufgania
  const results = sufganiot.map(sufgania => {
    const scores = {
      taste: 0,
      creativity: 0,
      presentation: 0,
    };

    const voteCounts = {
      taste: 0,
      creativity: 0,
      presentation: 0,
    };

    // Filter votes for this sufgania
    const sufganiaVotes = votes.filter(
      v => v.sufganiaId.toString() === sufgania._id.toString()
    );

    // Calculate points from votes
    sufganiaVotes.forEach(vote => {
      // Convert rank to points: rank 1 = highest points
      const points = totalSufganiot - vote.rank + 1;
      scores[vote.category] += points;
      voteCounts[vote.category]++;
    });

    // Calculate total score
    const totalScore = scores.taste + scores.creativity + scores.presentation;

    // Calculate average scores (in case not all couples voted)
    const averageScores = {
      taste: voteCounts.taste > 0 ? scores.taste / voteCounts.taste : 0,
      creativity: voteCounts.creativity > 0 ? scores.creativity / voteCounts.creativity : 0,
      presentation: voteCounts.presentation > 0 ? scores.presentation / voteCounts.presentation : 0,
    };

    // Get comments for this sufgania
    const sufganiaComments = comments
      .filter(c => c.sufganiaId.toString() === sufgania._id.toString())
      .map(c => ({
        text: c.commentText,
        voterCoupleId: c.voterCoupleId,
      }));

    return {
      id: sufgania._id,
      name: sufgania.name,
      photoUrl: sufgania.photoUrl,
      couple: sufgania.couple,
      scores: {
        taste: scores.taste,
        creativity: scores.creativity,
        presentation: scores.presentation,
        total: totalScore,
      },
      averageScores,
      voteCounts,
      totalVotes: sufganiaVotes.length,
      comments: sufganiaComments,
    };
  });

  // Sort by total score (descending)
  results.sort((a, b) => b.scores.total - a.scores.total);

  // Add rankings
  results.forEach((result, index) => {
    result.rank = index + 1;
  });

  return results;
};

/**
 * Calculate rankings for a specific category
 * @param {string} category - Category to rank (taste, creativity, presentation)
 * @returns {Promise<Array>} Array of sufganiot ranked by category
 */
export const calculateCategoryRankings = async (category) => {
  const results = await calculateRankings();

  // Sort by category score
  results.sort((a, b) => b.scores[category] - a.scores[category]);

  // Update rankings based on category
  results.forEach((result, index) => {
    result.categoryRank = index + 1;
  });

  return results;
};

export default {
  calculateRankings,
  calculateCategoryRankings,
};
