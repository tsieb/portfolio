// File: /backend/src/services/admin.js
// Admin service for user and data management

const User = require('../db/models/user');
const SpotifyTrack = require('../db/models/spotifyTrack');
const UserNotification = require('../db/models/userNotification');
const AppSetting = require('../db/models/appSetting');
const { AppError } = require('../middleware/error');

/**
 * Get admin dashboard data
 * @returns {Promise<Object>} Dashboard data
 */
const getDashboardData = async () => {
  // Get user counts
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ 
    lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
  });
  const spotifyConnectedUsers = await User.countDocuments({ spotifyConnected: true });
  
  // Get track stats
  const totalTracks = await SpotifyTrack.countDocuments();
  const tracksToday = await SpotifyTrack.countDocuments({ 
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });
  
  // Get top artists across all users
  const topArtists = await SpotifyTrack.aggregate([
    { $group: { _id: '$artistName', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  // Get top tracks across all users
  const topTracks = await SpotifyTrack.aggregate([
    { $group: { _id: { trackId: '$trackId', name: '$trackName' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  
  // Get most active users
  const mostActiveUsers = await SpotifyTrack.aggregate([
    { $group: { _id: '$user', trackCount: { $sum: 1 } } },
    { $sort: { trackCount: -1 } },
    { $limit: 5 },
    { $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userData'
    }},
    { $unwind: '$userData' },
    { $project: {
        _id: 1,
        trackCount: 1,
        username: '$userData.username',
        displayName: '$userData.displayName',
        avatar: '$userData.avatar'
    }}
  ]);
  
  // Get listening trends (tracks per day for the last 14 days)
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  
  const listeningTrends = await SpotifyTrack.aggregate([
    { 
      $match: { 
        playedAt: { $gte: twoWeeksAgo } 
      } 
    },
    {
      $group: {
        _id: { 
          $dateToString: { format: '%Y-%m-%d', date: '$playedAt' } 
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  
  // Get recent tracks
  const recentTracks = await SpotifyTrack.find()
    .sort({ playedAt: -1 })
    .limit(10)
    .populate('user', 'username displayName avatar');
  
  return {
    userStats: {
      totalUsers,
      activeUsers,
      spotifyConnectedUsers
    },
    trackStats: {
      totalTracks,
      tracksToday
    },
    topArtists,
    topTracks,
    mostActiveUsers,
    listeningTrends,
    recentTracks
  };
};

/**
 * Get all users with filtering and pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Users with pagination
 */
const getUsers = async (options = {}) => {
  const {
    page = 1,
    limit = 20,
    search = '',
    sort = 'createdAt',
    order = 'desc',
    onlySpotifyConnected = false
  } = options;
  
  const skip = (page - 1) * limit;
  
  // Build query
  const query = {};
  
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { displayName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (onlySpotifyConnected) {
    query.spotifyConnected = true;
  }
  
  // Execute query with pagination
  const users = await User.find(query)
    .select('-password -__v')
    .sort({ [sort]: order === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);
  
  // Get total count
  const total = await User.countDocuments(query);
  
  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get a user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password -__v');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Get track count
  const trackCount = await SpotifyTrack.countDocuments({ user: userId });
  
  // Get follower/following counts
  const followersCount = await UserFollow.countDocuments({ following: userId });
  const followingCount = await UserFollow.countDocuments({ follower: userId });
  
  return {
    ...user.toObject(),
    trackCount,
    followersCount,
    followingCount
  };
};

/**
 * Update a user (admin only)
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated user
 */
const updateUser = async (userId, updates) => {
  const allowedUpdates = [
    'username',
    'email',
    'displayName',
    'bio',
    'isPublic',
    'role',
    'active'
  ];
  
  const filteredUpdates = Object.keys(updates)
    .filter(key => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});
  
  // Special handling for username to ensure uniqueness
  if (updates.username) {
    const existingUser = await User.findOne({
      username: updates.username,
      _id: { $ne: userId }
    });
    
    if (existingUser) {
      throw new AppError('Username is already taken', 400);
    }
  }
  
  const user = await User.findByIdAndUpdate(
    userId,
    filteredUpdates,
    { new: true, runValidators: true }
  ).select('-password -__v');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user;
};

/**
 * Create test user (admin only)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createTestUser = async (userData) => {
  // Check if username or email already exists
  const existingUser = await User.findOne({
    $or: [
      { username: userData.username },
      { email: userData.email }
    ]
  });
  
  if (existingUser) {
    throw new AppError('Username or email already in use', 400);
  }
  
  // Create the user
  const user = await User.create({
    username: userData.username,
    email: userData.email,
    password: userData.password || 'password123',
    displayName: userData.displayName || userData.username,
    bio: userData.bio || '',
    isPublic: userData.isPublic !== undefined ? userData.isPublic : true,
    role: userData.role || 'user',
    onboardingCompleted: true
  });
  
  // Remove password from response
  user.password = undefined;
  
  return user;
};

/**
 * Delete a user (admin only)
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
const deleteUser = async (userId) => {
  // Delete the user
  const user = await User.findByIdAndDelete(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Delete associated data
  await Promise.all([
    SpotifyTrack.deleteMany({ user: userId }),
    UserNotification.deleteMany({ 
      $or: [
        { recipient: userId },
        { sender: userId }
      ]
    })
  ]);
  
  return true;
};

/**
 * Get tracks with pagination, filtering, and sorting
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Tracks with pagination
 */
const getTracks = async (options = {}) => {
  const {
    page = 1,
    limit = 20,
    sort = 'playedAt',
    order = 'desc',
    artist = '',
    track = '',
    album = '',
    userId = null,
    startDate = null,
    endDate = null
  } = options;
  
  const skip = (page - 1) * limit;
  
  // Build query
  const query = {};
  
  if (userId) {
    query.user = userId;
  }
  
  if (artist) {
    query.artistName = { $regex: artist, $options: 'i' };
  }
  
  if (track) {
    query.trackName = { $regex: track, $options: 'i' };
  }
  
  if (album) {
    query.albumName = { $regex: album, $options: 'i' };
  }
  
  if (startDate) {
    if (!query.playedAt) query.playedAt = {};
    query.playedAt.$gte = new Date(startDate);
  }
  
  if (endDate) {
    if (!query.playedAt) query.playedAt = {};
    query.playedAt.$lte = new Date(endDate);
  }
  
  // Execute query with pagination
  const tracks = await SpotifyTrack.find(query)
    .populate('user', 'username displayName avatar')
    .sort({ [sort]: order === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);
  
  // Get total count
  const total = await SpotifyTrack.countDocuments(query);
  
  return {
    tracks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Delete a track (admin only)
 * @param {string} trackId - Track ID
 * @returns {Promise<boolean>} Success status
 */
const deleteTrack = async (trackId) => {
  const track = await SpotifyTrack.findByIdAndDelete(trackId);
  
  if (!track) {
    throw new AppError('Track not found', 404);
  }
  
  return true;
};

/**
 * Get application settings
 * @param {boolean} publicOnly - Only return public settings
 * @returns {Promise<Object>} Application settings
 */
const getAppSettings = async (publicOnly = false) => {
  let settings;
  
  if (publicOnly) {
    settings = await AppSetting.find({ isPublic: true });
  } else {
    settings = await AppSetting.find();
  }
  
  // Convert to object with key-value pairs
  return settings.reduce((result, setting) => {
    result[setting.key] = {
      value: setting.value,
      description: setting.description,
      isPublic: setting.isPublic
    };
    return result;
  }, {});
};

/**
 * Update application settings
 * @param {Object} settings - Settings to update
 * @returns {Promise<Object>} Updated settings
 */
const updateAppSettings = async (settings) => {
  const updates = [];
  
  for (const [key, data] of Object.entries(settings)) {
    updates.push(
      AppSetting.findOneAndUpdate(
        { key },
        {
          value: data.value,
          description: data.description || '',
          isPublic: data.isPublic || false
        },
        { upsert: true, new: true }
      )
    );
  }
  
  const updatedSettings = await Promise.all(updates);
  
  // Convert to object with key-value pairs
  return updatedSettings.reduce((result, setting) => {
    result[setting.key] = {
      value: setting.value,
      description: setting.description,
      isPublic: setting.isPublic
    };
    return result;
  }, {});
};

module.exports = {
  getDashboardData,
  getUsers,
  getUserById,
  updateUser,
  createTestUser,
  deleteUser,
  getTracks,
  deleteTrack,
  getAppSettings,
  updateAppSettings
};