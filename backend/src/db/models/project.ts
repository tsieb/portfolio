import mongoose, { Document, Schema } from 'mongoose';

/**
 * Project interface extending Document
 */
export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project schema
 */
const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      required: [true, 'Technologies are required'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    githubUrl: {
      type: String,
      required: [true, 'GitHub URL is required'],
    },
    liveUrl: {
      type: String,
      required: [true, 'Live URL is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProject>('Project', ProjectSchema);