import mongoose, { Document, Schema } from 'mongoose';

/**
 * Social links interface
 */
interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  [key: string]: string | undefined;
}

/**
 * Skill interface
 */
interface ISkill {
  name: string;
  level: number;
}

/**
 * Experience interface
 */
interface IExperience {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

/**
 * Education interface
 */
interface IEducation {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

/**
 * Portfolio interface extending Document
 */
export interface IPortfolio extends Document {
  owner: {
    name: string;
    title: string;
    bio: string;
    email: string;
    location: string;
    avatar: string;
    social: ISocialLinks;
  };
  skills: ISkill[];
  experience: IExperience[];
  education: IEducation[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Portfolio schema
 */
const PortfolioSchema: Schema = new Schema(
  {
    owner: {
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
      },
      title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
      },
      bio: {
        type: String,
        required: [true, 'Bio is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
      },
      location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
      },
      avatar: {
        type: String,
        required: [true, 'Avatar URL is required'],
      },
      social: {
        github: String,
        linkedin: String,
        twitter: String,
      },
    },
    skills: [
      {
        name: {
          type: String,
          required: [true, 'Skill name is required'],
          trim: true,
        },
        level: {
          type: Number,
          required: [true, 'Skill level is required'],
          min: [0, 'Skill level must be between 0 and 100'],
          max: [100, 'Skill level must be between 0 and 100'],
        },
      },
    ],
    experience: [
      {
        role: {
          type: String,
          required: [true, 'Role is required'],
          trim: true,
        },
        company: {
          type: String,
          required: [true, 'Company is required'],
          trim: true,
        },
        location: {
          type: String,
          required: [true, 'Location is required'],
          trim: true,
        },
        startDate: {
          type: String,
          required: [true, 'Start date is required'],
        },
        endDate: {
          type: String,
          default: null,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          required: [true, 'Description is required'],
          trim: true,
        },
      },
    ],
    education: [
      {
        degree: {
          type: String,
          required: [true, 'Degree is required'],
          trim: true,
        },
        institution: {
          type: String,
          required: [true, 'Institution is required'],
          trim: true,
        },
        location: {
          type: String,
          required: [true, 'Location is required'],
          trim: true,
        },
        startDate: {
          type: String,
          required: [true, 'Start date is required'],
        },
        endDate: {
          type: String,
          required: [true, 'End date is required'],
        },
        description: {
          type: String,
          required: [true, 'Description is required'],
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);