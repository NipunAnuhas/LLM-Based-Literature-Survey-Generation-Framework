import { Router, Request, Response } from 'express';
import {
  WorkflowProgressRequestSchema,
  WorkflowCallbackRequestSchema,
} from 'shared';
import { asyncHandler } from '../middleware/errorHandler';
import { validateBody, requireCallbackSecret } from '../middleware/validation';
import * as workflowService from '../services/workflowService';
import { __internal as surveyInternal } from '../controllers/surveyController';

const router = Router();

router.post(
  '/progress',
  requireCallbackSecret,
  validateBody(WorkflowProgressRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { executionId, stage, progress, message } = req.body;

    // Update in-memory state so polling clients see immediate progress.
    const state = surveyInternal.inflight.get(executionId);
    if (state && state.status !== 'complete' && state.status !== 'error') {
      state.currentStage = stage as any;
      state.progress = progress;
      state.message = message;
      surveyInternal.stopSimulator(executionId);
      surveyInternal.inflight.set(executionId, state);
    }

    if (!state?.isDemo) {
      await workflowService
        .updateWorkflowStatus(executionId, stage as any, progress, message, stage as any)
        .catch(() => undefined);
    }

    res.json({ ok: true });
  })
);

router.post(
  '/callback',
  requireCallbackSecret,
  validateBody(WorkflowCallbackRequestSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { executionId, status, survey, error } = req.body;

    const state = surveyInternal.inflight.get(executionId);
    const topic =
      state?.topic ||
      (await workflowService.getWorkflowExecution(executionId).catch(() => null))?.topic ||
      'Untitled';

    if (status === 'complete' && survey) {
      await surveyInternal.completeExecution(executionId, topic, survey as any);
    } else if (status === 'error') {
      await surveyInternal.failExecution(
        executionId,
        error?.stage || 'synthesis',
        error?.message || 'Workflow reported an error'
      );
    } else {
      // Intermediate status update — just record on the state.
      if (state) {
        state.status = status as any;
        state.message = error?.message || state.message;
        surveyInternal.inflight.set(executionId, state);
      }
    }

    res.json({ ok: true });
  })
);

export default router;
