// File: /backend/src/db/models/userNotification.js
// Model for user notifications

const mongoose = require('mongoose');

const userNotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      required: true,
      enum: ['follow', 'mention', 'welcome', 'system', 'track']
    },
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel'
    },
    onModel: {
      type: String,
      enum: ['User', 'SpotifyTrack']
    },
    data: {
      type: Object
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient querying
userNotificationSchema.index({ recipient: 1, createdAt: -1 });
userNotificationSchema.index({ recipient: 1, read: 1 });

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);

module.exports = UserNotification;