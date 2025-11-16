import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    votingOpen: {
      type: Boolean,
      default: false,
    },
    resultsPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to get or create settings (singleton pattern)
settingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      votingOpen: false,
      resultsPublished: false,
    });
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
