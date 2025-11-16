// MongoDB models - relationships handled via virtuals and populate
import Couple from './Couple.js';
import Sufgania from './Sufgania.js';
import Vote from './Vote.js';
import Comment from './Comment.js';
import Settings from './Settings.js';

// No need for explicit associations in Mongoose
// Relationships are defined in schemas via virtuals and refs

export {
  Couple,
  Sufgania,
  Vote,
  Comment,
  Settings,
};
