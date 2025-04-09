// File: /backend/src/db/models/userFollow.js
// Model for user follow relationships

const mongoose = require('mongoose');

const userFollowSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index to ensure uniqueness and query efficiency
userFollowSchema.index({ follower: 1, following: 1 }, { unique: true });

const UserFollow = mongoose.model('UserFollow', userFollowSchema);

module.exports = UserFollow;