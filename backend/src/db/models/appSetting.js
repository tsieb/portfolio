// File: /backend/src/db/models/appSetting.js
// Model for application settings

const mongoose = require('mongoose');

const appSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    description: {
      type: String
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Static method to get a setting by key
appSettingSchema.statics.getSetting = async function(key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static method to set a setting value
appSettingSchema.statics.setSetting = async function(key, value, description = '', isPublic = false) {
  return this.findOneAndUpdate(
    { key },
    { value, description, isPublic },
    { upsert: true, new: true }
  );
};

// Static method to get all public settings
appSettingSchema.statics.getPublicSettings = async function() {
  const settings = await this.find({ isPublic: true });
  return settings.reduce((result, setting) => {
    result[setting.key] = setting.value;
    return result;
  }, {});
};

const AppSetting = mongoose.model('AppSetting', appSettingSchema);

module.exports = AppSetting;