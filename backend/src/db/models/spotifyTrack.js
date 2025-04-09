// File: /backend/src/db/models/user.js
// Enhanced user model with profile and privacy fields

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(email) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: 'Please provide a valid email address'
      }
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      validate: {
        validator: function(username) {
          return /^[a-zA-Z0-9_-]+$/.test(username);
        },
        message: 'Username can only contain letters, numbers, underscores and hyphens'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false // Don't include password in query results by default
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    displayName: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [300, 'Bio cannot exceed 300 characters']
    },
    avatar: {
      type: String
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    allowedViewers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    spotifyToken: {
      accessToken: String,
      refreshToken: String,
      expiresAt: Date
    },
    spotifyConnected: {
      type: Boolean,
      default: false
    },
    spotifyId: {
      type: String
    },
    lastActive: {
      type: Date,
      default: Date.now
    },
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.displayName || this.username;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next();
  
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  
  // Update passwordChangedAt field
  this.passwordChangedAt = Date.now() - 1000;
  
  next();
});

// Method to compare password
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password changed after token issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to check if a user can view another user's profile
userSchema.methods.canView = function(targetUser) {
  // Admin can view all profiles
  if (this.role === 'admin') return true;
  
  // Users can view their own profile
  if (this._id.equals(targetUser._id)) return true;
  
  // Users can view public profiles
  if (targetUser.isPublic) return true;
  
  // Check if user is in allowed viewers
  if (targetUser.allowedViewers && targetUser.allowedViewers.some(viewer => 
    viewer.equals(this._id)
  )) {
    return true;
  }
  
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;