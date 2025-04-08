// /backend/src/db/models/project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    fullDescription: {
      type: String,
      trim: true
    },
    technologies: [
      {
        type: String,
        trim: true
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    imageUrl: {
      type: String,
      trim: true
    },
    demoUrl: {
      type: String,
      trim: true
    },
    sourceUrl: {
      type: String,
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: '#5d8eff' // Default accent color
    },
    completionDate: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Create slug from title
 */
projectSchema.pre('save', function(next) {
  // Only update slug if title is modified or new document
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;