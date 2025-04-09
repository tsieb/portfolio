// File: /backend/src/db/models/spotifyTrack.js
// Spotify track schema definition for storing listening history

const mongoose = require('mongoose');

/**
 * Spotify Track Schema
 * Stores information about tracks the user has listened to
 */
const spotifyTrackSchema = new mongoose.Schema(
  {
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

// Index for efficient querying
spotifyTrackSchema.index({ trackId: 1, playedAt: -1 });

/**
 * Static method to get currently playing track
 * @returns {Promise<Object>} The currently playing track or null
 */
spotifyTrackSchema.statics.getCurrentlyPlaying = async function() {
  return this.findOne({ isCurrentlyPlaying: true })
    .sort({ playedAt: -1 })
    .exec();
};

/**
 * Static method to get listening history
 * @param {number} limit - Number of tracks to get
 * @param {number} skip - Number of tracks to skip
 * @returns {Promise<Array>} Array of track objects
 */
spotifyTrackSchema.statics.getHistory = async function(limit = 10, skip = 0) {
  return this.find()
    .sort({ playedAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

/**
 * Static method to get listening statistics
 * @returns {Promise<Object>} Object containing statistics
 */
spotifyTrackSchema.statics.getStatistics = async function() {
  // Get total tracks
  const totalTracks = await this.countDocuments();
  
  // Get top artists
  const topArtists = await this.aggregate([
    { $group: { _id: '$artistName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  // Get top tracks
  const topTracks = await this.aggregate([
    { $group: { _id: { trackId: '$trackId', name: '$trackName' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  // Get listening activity by hour
  const activityByHour = await this.aggregate([
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