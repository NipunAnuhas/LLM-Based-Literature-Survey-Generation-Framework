import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request body failed validation',
          details: result.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
          retryable: false,
          timestamp: new Date().toISOString(),
        },
      });
    }
    req.body = result.data;
    next();
  };
};

export const validateUUID = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.params[paramName];
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(uuid)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_UUID',
          message: `Invalid ${paramName}: must be a valid UUID`,
          retryable: false,
          timestamp: new Date().toISOString(),
        },
      });
    }

    next();
  };
};

export const requireCallbackSecret = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const expected = process.env.N8N_CALLBACK_SECRET;
  if (!expected) {
    return next();
  }
  const provided = req.header('x-n8n-secret');
  if (provided !== expected) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid X-N8N-Secret header',
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }
  next();
};
