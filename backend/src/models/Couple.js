import mongoose from 'mongoose';

const coupleSchema = new mongoose.Schema(
  {
    coupleName: {
      type: String,
      required: [true, 'Couple name is required'],
      unique: true,
      trim: true,
    },
    loginCode: {
      type: String,
      required: [true, 'Login code is required'],
      unique: true,
      uppercase: true,
    },
    hasVoted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for sufgania relationship
coupleSchema.virtual('sufgania', {
  ref: 'Sufgania',
  localField: '_id',
  foreignField: 'coupleId',
  justOne: true,
});

// Indexes
coupleSchema.index({ loginCode: 1 });
coupleSchema.index({ coupleName: 1 });

const Couple = mongoose.model('Couple', coupleSchema);

export default Couple;
