// /backend/src/db/models/skill.js
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      trim: true
    },
    proficiency: {
      type: Number,
      required: [true, 'Proficiency level is required'],
      min: [1, 'Proficiency must be at least 1'],
      max: [100, 'Proficiency cannot exceed 100']
    },
    icon: {
      type: String,
      trim: true
    },
    color: {
      type: String,
      trim: true,
      default: '#5d8eff' // Default accent color
    },
    description: {
      type: String,
      trim: true
    },
    order: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    yearsOfExperience: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;