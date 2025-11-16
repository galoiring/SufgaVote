import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
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
    commentText: {
      type: String,
      required: [true, 'Comment text is required'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
      minlength: [1, 'Comment cannot be empty'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for voter relationship
commentSchema.virtual('voter', {
  ref: 'Couple',
  localField: 'voterCoupleId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for sufgania relationship
commentSchema.virtual('sufgania', {
  ref: 'Sufgania',
  localField: 'sufganiaId',
  foreignField: '_id',
  justOne: true,
});

// Compound unique index - one comment per couple per sufgania
commentSchema.index(
  { voterCoupleId: 1, sufganiaId: 1 },
  { unique: true }
);

// Additional indexes
commentSchema.index({ voterCoupleId: 1 });
commentSchema.index({ sufganiaId: 1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
