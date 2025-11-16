import mongoose from 'mongoose';

const sufganiaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sufgania name is required'],
      trim: true,
    },
    coupleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Couple',
      required: [true, 'Couple ID is required'],
    },
    photoUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for couple relationship
sufganiaSchema.virtual('couple', {
  ref: 'Couple',
  localField: 'coupleId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for votes relationship
sufganiaSchema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'sufganiaId',
});

// Virtual for comments relationship
sufganiaSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'sufganiaId',
});

// Indexes
sufganiaSchema.index({ coupleId: 1 });
sufganiaSchema.index({ name: 1 });

// Ensure one sufgania per couple
sufganiaSchema.index({ coupleId: 1 }, { unique: true });

const Sufgania = mongoose.model('Sufgania', sufganiaSchema);

export default Sufgania;
