// File: /backend/src/db/models/spotifyTrack.js
// Enhanced track model with user reference

const mongoose = require('mongoose');

const spotifyTrackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    trackId: {
      type: String,
      required: true,
      index: true
    },
    trackName: {
      type: String,
      required: true
    },
    artistName: {
      type: String,
      required: true
    },
    albumName: {
      type: String,
      required: true
    },
    albumImageUrl: {
      type: String
    },
    duration: {
      type: Number
    },
    popularity: {
      type: Number
    },
    previewUrl: {
      type: String
    },
    playedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    isCurrentlyPlaying: {
      type: Boolean,
      default: false
    },
    genres: [{
      type: String
    }],
    // Additional metadata
    trackUri: String,
    trackUrl: String,
    artistId: String,
    artistUrl: String,
    albumId: String,
    albumUrl: String,
    albumReleaseDate: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index for efficient querying
spotifyTrackSchema.index({ user: 1, trackId: 1, playedAt: -1 });

// Get currently playing track for a specific user
spotifyTrackSchema.statics.getCurrentlyPlaying = async function(userId) {
  return this.findOne({ 
    user: userId,
    isCurrentlyPlaying: true 
  })
    .sort({ playedAt: -1 })
    .exec();
};

// Get listening history for a specific user
spotifyTrackSchema.statics.getHistory = async function(userId, limit = 10, skip = 0) {
  return this.find({ user: userId })
    .sort({ playedAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

// Get listening statistics for a specific user
spotifyTrackSchema.statics.getStatistics = async function(userId) {
  // Get total tracks
  const totalTracks = await this.countDocuments({ user: userId });
  
  // Get top artists
  const topArtists = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$artistName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  // Get top tracks
  const topTracks = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: { trackId: '$trackId', name: '$trackName' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  // Get listening activity by hour
  const activityByHour = await this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId) } },
    { 
      $group: { 
        _id: { $hour: '$playedAt' }, 
        count: { $sum: 1 } 
      } 
    },
    { $sort: { _id: 1 } }
  ]);
  
  return {
    totalTracks,
    topArtists,
    topTracks,
    activityByHour
  };
};

const SpotifyTrack = mongoose.model('SpotifyTrack', spotifyTrackSchema);

module.exports = SpotifyTrack;