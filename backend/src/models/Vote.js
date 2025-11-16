import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema(
  {
    voterCoupleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Couple',
      required: [true, 'Voter couple ID is required'],
    },
    sufganiaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sufgania',
      required: [true, 'Sufgania ID is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['taste', 'creativity', 'presentation'],
        message: '{VALUE} is not a valid category',
      },
    },
    rank: {
      type: Number,
      required: [true, 'Rank is required'],
      min: [1, 'Rank must be at least 1'],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for voter relationship
voteSchema.virtual('voter', {
  ref: 'Couple',
  localField: 'voterCoupleId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for sufgania relationship
voteSchema.virtual('sufgania', {
  ref: 'Sufgania',
  localField: 'sufganiaId',
  foreignField: '_id',
  justOne: true,
});

// Compound unique index - one vote per couple per sufgania per category
voteSchema.index(
  { voterCoupleId: 1, sufganiaId: 1, category: 1 },
  { unique: true }
);

// Additional indexes for queries
voteSchema.index({ voterCoupleId: 1 });
voteSchema.index({ sufganiaId: 1 });
voteSchema.index({ category: 1 });

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
