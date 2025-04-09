// File: /backend/src/services/user.js
// User service for profile management

const User = require('../db/models/user');
const UserFollow = require('../db/models/userFollow');
const UserNotification = require('../db/models/userNotification');
const { AppError } = require('../middleware/error');

/**
 * Get user profile by username
 * @param {string} username - Username to find
 * @param {Object} currentUser - Current user requesting the profile
 * @returns {Promise<Object>} User profile with additional access information
 */
const getUserProfile = async (username, currentUser = null) => {
  // Find the user by username
  const user = await User.findOne({ username }).select('-spotifyToken -__v');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Determine if current user has access to this profile
  let hasAccess = user.isPublic;
  
  if (currentUser) {
    // Admin or self can access
    if (currentUser.role === 'admin' || currentUser._id.equals(user._id)) {
      hasAccess = true;
    } 
    // Check if current user is in allowed viewers
    else if (user.allowedViewers && user.allowedViewers.some(id => id.equals(currentUser._id))) {
      hasAccess = true;
    }
  }
  
  // Get follower/following counts
  const followersCount = await UserFollow.countDocuments({ following: user._id });
  const followingCount = await UserFollow.countDocuments({ follower: user._id });
  
  // If current user is logged in, check if they follow this user
  let isFollowing = false;
  if (currentUser && !currentUser._id.equals(user._id)) {
    isFollowing = await UserFollow.exists({ 
      follower: currentUser._id, 
      following: user._id 
    });
  }
  
  // Format the result
  const result = {
    ...user.toObject(),
    followersCount,
    followingCount,
    hasAccess,
    isFollowing
  };
  
  // Remove sensitive fields if not authorized
  if (!hasAccess && !user.isPublic) {
    // Return limited data for private profiles
    return {
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      isPublic: user.isPublic,
      spotifyConnected: user.spotifyConnected,
      followersCount,
      followingCount,
      isFollowing,
      hasAccess: false
    };
  }
  
  return result;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated user
 */
const updateUserProfile = async (userId, updates) => {
  // Fields that can be updated by the user
  const allowedUpdates = [
    'displayName', 
    'bio', 
    'isPublic'
  ];
  
  // Only keep allowed fields from updates
  const filteredUpdates = Object.keys(updates)
    .filter(key => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = updates[key];
      return obj;
    }, {});
  
  // Handle username change separately with validation
  if (updates.username) {
    // Check username format
    if (!/^[a-zA-Z0-9_-]{3,20}$/.test(updates.username)) {
      throw new AppError('Username must be 3-20 characters and can only contain letters, numbers, underscores and hyphens', 400);
    }
    
    // Check if username is taken
    const existingUser = await User.findOne({ 
      username: updates.username,
      _id: { $ne: userId } // Exclude current user
    });
    
    if (existingUser) {
      throw new AppError('Username is already taken', 400);
    }
    
    filteredUpdates.username = updates.username;
  }
  
  const user = await User.findByIdAndUpdate(
    userId,
    filteredUpdates,
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user;
};

/**
 * Search for users
 * @param {string} query - Search query
 * @param {number} limit - Max number of results
 * @param {Object} currentUser - Current user making the request
 * @returns {Promise<Array>} Users matching query
 */
const searchUsers = async (query, limit = 10, currentUser = null) => {
  if (!query || query.length < 2) {
    throw new AppError('Search query must be at least 2 characters', 400);
  }
  
  // Create query conditions
  const conditions = {
    $or: [
      { username: { $regex: query, $options: 'i' } },
      { displayName: { $regex: query, $options: 'i' } }
    ]
  };
  
  // If not admin, only return public profiles or profiles the user can access
  if (!currentUser || currentUser.role !== 'admin') {
    // Show public profiles
    const publicCondition = { isPublic: true };
    
    // Add filter for the current user's own profile
    if (currentUser) {
      // Show own profile
      const ownProfileCondition = { _id: currentUser._id };
      
      // Show profiles where current user is an allowed viewer
      const allowedProfilesCondition = { 
        allowedViewers: currentUser._id 
      };
      
      conditions.$or.push(ownProfileCondition);
      conditions.$or.push(allowedProfilesCondition);
      
      // Add public condition at the beginning
      conditions.$or.unshift(publicCondition);
    } else {
      // For non-logged in users, only show public profiles
      conditions.isPublic = true;
    }
  }
  
  // Find users matching the query
  const users = await User.find(conditions)
    .select('_id username displayName avatar isPublic spotifyConnected')
    .limit(limit);
  
  return users;
};

/**
 * Update user privacy settings
 * @param {string} userId - User ID
 * @param {Object} settings - Privacy settings to update
 * @returns {Promise<Object>} Updated user
 */
const updatePrivacySettings = async (userId, settings) => {
  const allowedSettings = ['isPublic'];
  
  const filteredSettings = Object.keys(settings)
    .filter(key => allowedSettings.includes(key))
    .reduce((obj, key) => {
      obj[key] = settings[key];
      return obj;
    }, {});
  
  const user = await User.findByIdAndUpdate(
    userId,
    filteredSettings,
    { new: true, runValidators: true }
  );
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user;
};

/**
 * Get allowed viewers for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Allowed viewers
 */
const getAllowedViewers = async (userId) => {
  const user = await User.findById(userId)
    .populate('allowedViewers', '_id username displayName avatar');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user.allowedViewers || [];
};

/**
 * Add an allowed viewer to a user's profile
 * @param {string} userId - User ID
 * @param {string} viewerId - Viewer user ID to add
 * @returns {Promise<Array>} Updated allowed viewers
 */
const addAllowedViewer = async (userId, viewerId) => {
  // Check if viewer exists
  const viewer = await User.findById(viewerId);
  if (!viewer) {
    throw new AppError('Viewer user not found', 404);
  }
  
  // Can't add yourself as viewer
  if (userId === viewerId) {
    throw new AppError('You cannot add yourself as an allowed viewer', 400);
  }
  
  // Update user, adding viewer to allowedViewers if not already present
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { allowedViewers: viewerId } },
    { new: true }
  ).populate('allowedViewers', '_id username displayName avatar');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Create notification for viewer
  await UserNotification.create({
    recipient: viewerId,
    sender: userId,
    type: 'system',
    message: `${user.displayName || user.username} granted you access to their private profile`,
    relatedId: userId,
    onModel: 'User'
  });
  
  return user.allowedViewers;
};

/**
 * Remove an allowed viewer from a user's profile
 * @param {string} userId - User ID
 * @param {string} viewerId - Viewer user ID to remove
 * @returns {Promise<Array>} Updated allowed viewers
 */
const removeAllowedViewer = async (userId, viewerId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { allowedViewers: viewerId } },
    { new: true }
  ).populate('allowedViewers', '_id username displayName avatar');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user.allowedViewers;
};

/**
 * Follow a user
 * @param {string} followerId - Follower user ID
 * @param {string} followingId - User ID to follow
 * @returns {Promise<Object>} Follow relationship
 */
const followUser = async (followerId, followingId) => {
  // Can't follow yourself
  if (followerId === followingId) {
    throw new AppError('You cannot follow yourself', 400);
  }
  
  // Check if both users exist
  const [follower, following] = await Promise.all([
    User.findById(followerId),
    User.findById(followingId)
  ]);
  
  if (!follower || !following) {
    throw new AppError('User not found', 404);
  }
  
  // Create follow relationship if it doesn't exist
  let follow = await UserFollow.findOne({ 
    follower: followerId, 
    following: followingId 
  });
  
  if (!follow) {
    follow = await UserFollow.create({
      follower: followerId,
      following: followingId
    });
    
    // Create notification
    await UserNotification.create({
      recipient: followingId,
      sender: followerId,
      type: 'follow',
      message: `${follower.displayName || follower.username} started following you`,
      relatedId: followerId,
      onModel: 'User'
    });
  }
  
  return follow;
};

/**
 * Unfollow a user
 * @param {string} followerId - Follower user ID
 * @param {string} followingId - User ID to unfollow
 * @returns {Promise<boolean>} Success status
 */
const unfollowUser = async (followerId, followingId) => {
  const result = await UserFollow.findOneAndDelete({ 
    follower: followerId, 
    following: followingId 
  });
  
  if (!result) {
    throw new AppError('Follow relationship not found', 404);
  }
  
  return true;
};

/**
 * Get user's followers
 * @param {string} userId - User ID
 * @param {number} limit - Max results
 * @param {number} skip - Skip count for pagination
 * @returns {Promise<Object>} Followers with pagination
 */
const getUserFollowers = async (userId, limit = 10, skip = 0) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Get followers with pagination
  const follows = await UserFollow.find({ following: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('follower', '_id username displayName avatar');
  
  const total = await UserFollow.countDocuments({ following: userId });
  
  return {
    followers: follows.map(f => f.follower),
    pagination: {
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get users the user is following
 * @param {string} userId - User ID
 * @param {number} limit - Max results
 * @param {number} skip - Skip count for pagination
 * @returns {Promise<Object>} Following with pagination
 */
const getUserFollowing = async (userId, limit = 10, skip = 0) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Get following with pagination
  const follows = await UserFollow.find({ follower: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('following', '_id username displayName avatar');
  
  const total = await UserFollow.countDocuments({ follower: userId });
  
  return {
    following: follows.map(f => f.following),
    pagination: {
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  searchUsers,
  updatePrivacySettings,
  getAllowedViewers,
  addAllowedViewer,
  removeAllowedViewer,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing
};