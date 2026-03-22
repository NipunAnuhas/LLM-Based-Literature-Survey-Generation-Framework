import { Request, Response, NextFunction } from 'express';

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    };

    // Color code based on status
    const statusColor =
      res.statusCode >= 500
        ? '\x1b[31m' // Red for 5xx
        : res.statusCode >= 400
        ? '\x1b[33m' // Yellow for 4xx
        : '\x1b[32m'; // Green for 2xx/3xx

    console.log(
      `${statusColor}${req.method}\x1b[0m ${req.path} - ${statusColor}${res.statusCode}\x1b[0m - ${duration}ms`
    );
  });

  next();
};
