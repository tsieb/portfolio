import { Request, Response, NextFunction } from 'express';

interface IApiError extends Error {
  statusCode?: number;
  details?: any[];
  code?: string;
}

/**
 * Global error handling middleware
 * Formats and returns consistent error responses
 */
export const errorHandler = (
  err: IApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'SERVER_ERROR';
  const details = err.details || [];

  console.error(`[ERROR] ${code}: ${message}`);

  res.status(statusCode).json({
    status: 'error',
    code,
    message,
    details,
  });
};