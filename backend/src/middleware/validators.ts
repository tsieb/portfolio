import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Generic request validation middleware factory
 * Creates a middleware that validates the request body against a schema
 */
export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.details.map((detail) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    
    next();
  };
};

/**
 * Validation schema for user registration
 */
const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6).max(50),
});

/**
 * Validation schema for user login
 */
const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

/**
 * Validation schema for contact message
 */
const contactSchema = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().required().email(),
  subject: Joi.string().max(100).allow('', null),
  message: Joi.string().required().min(10).max(1000),
});

/**
 * Validation schema for project creation
 */
const projectCreateSchema = Joi.object({
  title: Joi.string().required().min(2).max(100),
  description: Joi.string().required().min(10).max(1000),
  technologies: Joi.array().items(Joi.string()).required().min(1),
  image: Joi.string().required().uri(),
  githubUrl: Joi.string().required().uri(),
  liveUrl: Joi.string().required().uri(),
  featured: Joi.boolean().default(false),
});

/**
 * Validation schema for project update
 */
const projectUpdateSchema = Joi.object({
  title: Joi.string().min(2).max(100),
  description: Joi.string().min(10).max(1000),
  technologies: Joi.array().items(Joi.string()).min(1),
  image: Joi.string().uri(),
  githubUrl: Joi.string().uri(),
  liveUrl: Joi.string().uri(),
  featured: Joi.boolean(),
}).min(1);

/**
 * Validation schema for portfolio
 */
const portfolioSchema = Joi.object({
  owner: Joi.object({
    name: Joi.string().required().min(2).max(50),
    title: Joi.string().required().min(2).max(100),
    bio: Joi.string().required().min(10).max(1000),
    email: Joi.string().required().email(),
    location: Joi.string().required(),
    avatar: Joi.string().required().uri(),
    social: Joi.object({
      github: Joi.string().uri().allow('', null),
      linkedin: Joi.string().uri().allow('', null),
      twitter: Joi.string().uri().allow('', null),
    }),
  }).required(),
  skills: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        level: Joi.number().required().min(0).max(100),
      })
    )
    .required(),
  experience: Joi.array().items(
    Joi.object({
      role: Joi.string().required(),
      company: Joi.string().required(),
      location: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().allow(null, ''),
      current: Joi.boolean().default(false),
      description: Joi.string().required(),
    })
  ),
  education: Joi.array().items(
    Joi.object({
      degree: Joi.string().required(),
      institution: Joi.string().required(),
      location: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      description: Joi.string().required(),
    })
  ),
});

// Create validation middleware using the schemas
export const validateRegister = validateRequest(registerSchema);
export const validateLogin = validateRequest(loginSchema);
export const validateContact = validateRequest(contactSchema);
export const validateProjectCreate = validateRequest(projectCreateSchema);
export const validateProjectUpdate = validateRequest(projectUpdateSchema);
export const validatePortfolio = validateRequest(portfolioSchema);