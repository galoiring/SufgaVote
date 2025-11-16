import { Activity } from '../models/index.js';

/**
 * Log an activity
 */
export const logActivity = async (type, actor, details = '', metadata = {}) => {
  try {
    await Activity.create({
      type,
      actor,
      details,
      metadata,
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging shouldn't break the main flow
  }
};

/**
 * Get recent activities
 */
export const getRecentActivities = async (limit = 20) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return activities;
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
};

export default {
  logActivity,
  getRecentActivities,
};
