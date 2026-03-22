import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody, validateUUID } from '../middleware/validation';
import { CreateSurveyRequestSchema } from 'shared';
import * as surveyController from '../controllers/surveyController';

const router = Router();

// POST /api/surveys - Create new survey
router.post(
  '/',
  validateBody(CreateSurveyRequestSchema),
  asyncHandler(surveyController.createSurvey)
);

// POST /api/surveys/:executionId/complete - Complete survey (called by n8n)
router.post(
  '/:executionId/complete',
  validateUUID('executionId'),
  asyncHandler(surveyController.completeSurvey)
);

// GET /api/surveys/:executionId/status - Get workflow status
router.get(
  '/:executionId/status',
  validateUUID('executionId'),
  asyncHandler(surveyController.getSurveyStatus)
);

// GET /api/surveys/:surveyId - Get completed survey
router.get(
  '/:surveyId',
  validateUUID('surveyId'),
  asyncHandler(surveyController.getSurvey)
);

// POST /api/surveys/:surveyId/export - Export survey
router.post(
  '/:surveyId/export',
  validateUUID('surveyId'),
  asyncHandler(surveyController.exportSurvey)
);

export default router;
