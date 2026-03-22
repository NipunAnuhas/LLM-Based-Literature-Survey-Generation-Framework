import { Request, Response, NextFunction } from 'express';
import { validateCreateSurveyRequest } from 'shared';

/**
 * Validate request body against a schema
 */
export const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate UUID parameter
 */
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
