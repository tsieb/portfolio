import { Request, Response, NextFunction } from 'express';

/**
 * Generic request validation middleware factory
 * Creates a middleware that validates the request body against a schema
 */
export const validateRequest = (validateFn: (data: any) => { error?: any }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = validateFn(req.body);
    
    if (error) {
      return res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.details.map((detail: any) => ({
          field: detail.path.join('.'),
          message: detail.message,
        })),
      });
    }
    
    next();
  };
};