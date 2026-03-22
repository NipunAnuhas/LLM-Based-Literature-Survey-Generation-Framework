import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  retryable?: boolean;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Handle custom API errors
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const retryable = err.retryable !== undefined ? err.retryable : statusCode >= 500;

  res.status(statusCode).json({
    error: {
      code,
      message: err.message || 'An unexpected error occurred',
      retryable,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
      retryable: false,
      timestamp: new Date().toISOString(),
    },
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
