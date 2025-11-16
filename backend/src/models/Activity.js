import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['vote', 'comment', 'couple_created', 'sufgania_created', 'photo_uploaded', 'voting_opened', 'voting_closed', 'results_published'],
    },
    actor: {
      type: String, // Couple name or "Admin"
      required: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Couple',
    },
    details: {
      type: String, // e.g., "submitted rankings for Taste"
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Additional data
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for efficient querying of recent activities
activitySchema.index({ createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
