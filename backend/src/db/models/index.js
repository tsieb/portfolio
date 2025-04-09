// File: /backend/src/db/models/index.js
// Central location for model exports to prevent overwrite errors

const mongoose = require('mongoose');

// Check if models are already defined to prevent recompilation
let User, SpotifyTrack, UserNotification, UserFollow, AppSetting;

if (mongoose.models.User) {
  User = mongoose.models.User;
} else {
  User = require('./user');
}

if (mongoose.models.SpotifyTrack) {
  SpotifyTrack = mongoose.models.SpotifyTrack;
} else {
  SpotifyTrack = require('./spotifyTrack');
}

if (mongoose.models.UserNotification) {
  UserNotification = mongoose.models.UserNotification;
} else {
  UserNotification = require('./userNotification');
}

if (mongoose.models.UserFollow) {
  UserFollow = mongoose.models.UserFollow;
} else {
  UserFollow = require('./userFollow');
}

if (mongoose.models.AppSetting) {
  AppSetting = mongoose.models.AppSetting;
} else {
  AppSetting = require('./appSetting');
}

module.exports = {
  User,
  SpotifyTrack,
  UserNotification,
  UserFollow,
  AppSetting
};