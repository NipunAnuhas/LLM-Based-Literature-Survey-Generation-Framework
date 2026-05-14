import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateSurveyRequest,
  PipelineStage,
  Survey,
  WorkflowStatus,
} from 'shared';
import * as workflowService from '../services/workflowService';
import * as surveyService from '../services/surveyService';
import * as n8nService from '../services/n8nService';

interface InflightState {
  executionId: string;
  topic: string;
  status: WorkflowStatus;
  currentStage?: PipelineStage;
  progress: number;
  message: string;
  surveyId?: string;
  isDemo: boolean;
  simulatorHandle?: NodeJS.Timeout;
  error?: { stage: string; message: string; retryable: boolean };
}

const inflight = new Map<string, InflightState>();
const demoSurveys = new Map<string, Survey>();

const SIMULATED_STAGES: Array<{
  stage: PipelineStage;
  progress: number;
  message: string;
  delayMs: number;
}> = [
  { stage: 'query_expansion', progress: 15, message: 'Expanding search queries...', delayMs: 2000 },
  { stage: 'retrieval',       progress: 35, message: 'Retrieving papers from databases...', delayMs: 4000 },
  { stage: 'validation',      progress: 55, message: 'Validating paper quality...', delayMs: 4000 },
  { stage: 'evaluation',      progress: 75, message: 'Evaluating relevance and themes...', delayMs: 4000 },
  { stage: 'synthesis',       progress: 92, message: 'Synthesizing literature survey...', delayMs: 6000 },
];

const startSimulator = (executionId: string) => {
  let stageIndex = 0;
  const tick = () => {
    const state = inflight.get(executionId);
    if (!state || state.status === 'complete' || state.status === 'error') return;
    if (stageIndex >= SIMULATED_STAGES.length) return;

    const next = SIMULATED_STAGES[stageIndex++];
    state.status = next.stage;
    state.currentStage = next.stage;
    state.progress = next.progress;
    state.message = next.message;
    inflight.set(executionId, state);

    if (!state.isDemo) {
      workflowService
        .updateWorkflowStatus(executionId, next.stage, next.progress, next.message, next.stage)
        .catch(() => undefined);
    }

    state.simulatorHandle = setTimeout(tick, next.delayMs);
  };
  const state = inflight.get(executionId);
  if (state) state.simulatorHandle = setTimeout(tick, 1500);
};

const stopSimulator = (executionId: string) => {
  const state = inflight.get(executionId);
  if (state?.simulatorHandle) {
    clearTimeout(state.simulatorHandle);
    state.simulatorHandle = undefined;
  }
};

const normaliseSurveyForStorage = (raw: n8nService.N8nSurveyPayload) => {
  const generatedAt =
    typeof raw.metadata.generatedAt === 'string'
      ? new Date(raw.metadata.generatedAt)
      : raw.metadata.generatedAt;
  return {
    content: raw.content,
    metadata: { ...raw.metadata, generatedAt },
  };
};

const completeExecution = async (
  executionId: string,
  topic: string,
  surveyPayload: n8nService.N8nSurveyPayload
) => {
  const state = inflight.get(executionId);
  if (!state) return;
  stopSimulator(executionId);

  const normalised = normaliseSurveyForStorage(surveyPayload);
  let surveyId = executionId;

  if (!state.isDemo) {
    try {
      const persisted = await surveyService.createSurvey(
        executionId,
        topic,
        normalised.content,
        normalised.metadata
      );
      surveyId = persisted.id;
      await workflowService.updateWorkflowStatus(
        executionId,
        'complete',
        100,
        'Survey generation completed successfully',
        'synthesis'
      );
    } catch (err: any) {
      console.error('Failed to persist survey to DB, falling back to memory:', err.message);
      state.isDemo = true;
    }
  }

  if (state.isDemo) {
    const demoSurvey: Survey = {
      id: surveyId,
      executionId,
      topic,
      content: normalised.content,
      metadata: normalised.metadata as Survey['metadata'],
    };
    demoSurveys.set(surveyId, demoSurvey);
  }

  state.status = 'complete';
  state.progress = 100;
  state.message = 'Survey generation completed successfully';
  state.surveyId = surveyId;
  inflight.set(executionId, state);
};

const failExecution = async (
  executionId: string,
  stage: string,
  message: string
) => {
  const state = inflight.get(executionId);
  if (!state) return;
  stopSimulator(executionId);

  state.status = 'error';
  state.error = { stage, message, retryable: false };
  state.message = message;
  inflight.set(executionId, state);

  if (!state.isDemo) {
    await workflowService
      .updateWorkflowError(executionId, { stage, message, retryable: false })
      .catch(() => undefined);
  }
};

export const createSurvey = async (req: Request, res: Response) => {
  const { topic, options } = req.body as CreateSurveyRequest;

  let executionId: string;
  let isDemo = false;

  try {
    const execution = await workflowService.createWorkflowExecution(topic, options);
    executionId = execution.id;
  } catch (err) {
    console.warn('Database not available, using demo mode for this execution');
    executionId = uuidv4();
    isDemo = true;
  }

  inflight.set(executionId, {
    executionId,
    topic,
    status: 'initiated',
    progress: 0,
    message: isDemo ? 'Workflow initiated (Demo Mode)' : 'Workflow initiated',
    isDemo,
  });

  startSimulator(executionId);

  // Fire-and-forget n8n trigger; resolve/reject mutates inflight state.
  n8nService
    .triggerWorkflow({ topic, executionId, options })
    .then(async (result) => {
      if (result.success && 'deferred' in result && result.deferred) {
        return;
      }
      if (result.success && 'survey' in result) {
        await completeExecution(executionId, topic, result.survey);
      } else if (!result.success) {
        await failExecution(executionId, 'synthesis', result.error);
      }
    })
    .catch(async (err) => {
      await failExecution(executionId, 'synthesis', err?.message || 'Unknown error');
    });

  res.status(201).json({
    executionId,
    status: 'initiated',
    message: isDemo
      ? 'Survey generation workflow initiated (Demo Mode)'
      : 'Survey generation workflow initiated successfully',
  });
};

export const getSurveyStatus = async (req: Request, res: Response) => {
  const { executionId } = req.params;

  // Prefer in-memory state since it has the freshest simulator progress.
  const state = inflight.get(executionId);
  if (state) {
    return res.json({
      executionId: state.executionId,
      status: state.status,
      currentStage: state.currentStage,
      progress: state.progress,
      message: state.message,
      surveyId: state.surveyId,
      error: state.error,
    });
  }

  // Fall back to DB lookup.
  try {
    const execution = await workflowService.getWorkflowExecution(executionId);
    if (!execution) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Workflow execution ${executionId} not found`,
          retryable: false,
          timestamp: new Date().toISOString(),
        },
      });
    }
    const survey =
      execution.status === 'complete'
        ? await surveyService.getSurveyByExecutionId(executionId)
        : null;
    return res.json({
      executionId: execution.id,
      status: execution.status,
      currentStage: execution.currentStage,
      progress: execution.progress,
      message: execution.message,
      surveyId: survey?.id,
      error: execution.error
        ? {
            stage: execution.error.stage,
            message: execution.error.message,
            retryable: execution.error.retryable,
          }
        : undefined,
    });
  } catch (err) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Workflow execution ${executionId} not found`,
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

export const getSurvey = async (req: Request, res: Response) => {
  const { surveyId } = req.params;

  if (demoSurveys.has(surveyId)) {
    return res.json({ survey: demoSurveys.get(surveyId) });
  }

  try {
    const survey = await surveyService.getSurveyById(surveyId);
    if (survey) return res.json({ survey });
  } catch {
    // fall through to 404
  }

  return res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Survey ${surveyId} not found`,
      retryable: false,
      timestamp: new Date().toISOString(),
    },
  });
};

export const exportSurvey = async (req: Request, res: Response) => {
  const { surveyId } = req.params;
  const { format } = req.body;

  if (!['pdf', 'docx', 'json'].includes(format)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_FORMAT',
        message: 'Format must be one of: pdf, docx, json',
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }

  let survey: Survey | null = demoSurveys.get(surveyId) || null;
  if (!survey) {
    try {
      survey = await surveyService.getSurveyById(surveyId);
    } catch {
      survey = null;
    }
  }

  if (!survey) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Survey ${surveyId} not found`,
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="survey-${surveyId}.json"`);
    return res.json(survey);
  }

  const textContent = generateTextExport(survey);
  const buffer = Buffer.from(textContent, 'utf-8');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="survey-${surveyId}.txt"`);
  res.setHeader('Content-Length', buffer.length.toString());
  return res.send(buffer);
};

export const completeSurvey = async (req: Request, res: Response) => {
  const { executionId } = req.params;
  const { content, metadata } = req.body;

  try {
    const execution = await workflowService.getWorkflowExecution(executionId);
    if (!execution) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Workflow execution ${executionId} not found`,
          retryable: false,
          timestamp: new Date().toISOString(),
        },
      });
    }

    const survey = await surveyService.createSurvey(
      executionId,
      execution.topic,
      content,
      metadata
    );
    await workflowService.updateWorkflowStatus(
      executionId,
      'complete',
      100,
      'Survey generation completed successfully',
      'synthesis'
    );

    const state = inflight.get(executionId);
    if (state) {
      stopSimulator(executionId);
      state.status = 'complete';
      state.progress = 100;
      state.surveyId = survey.id;
      state.message = 'Survey generation completed successfully';
    }

    res.json({ success: true, surveyId: survey.id });
  } catch (error: any) {
    console.error('Error completing survey:', error);
    await workflowService
      .updateWorkflowError(executionId, {
        stage: 'synthesis',
        message: error.message,
        retryable: false,
      })
      .catch(() => undefined);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to store survey',
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

// Internal helpers exposed to the workflow router.
export const __internal = {
  inflight,
  demoSurveys,
  stopSimulator,
  completeExecution,
  failExecution,
};

function generateTextExport(survey: Survey): string {
  let text = `LITERATURE SURVEY\n`;
  text += `${'='.repeat(80)}\n\n`;
  text += `Topic: ${survey.topic}\n`;
  text += `Generated: ${new Date(survey.metadata.generatedAt).toLocaleString()}\n`;
  text += `Papers: ${survey.metadata.paperCount}\n`;
  text += `Words: ${survey.metadata.wordCount}\n\n`;
  text += `${'='.repeat(80)}\n\n`;

  text += `INTRODUCTION\n${'-'.repeat(80)}\n${survey.content.introduction}\n\n`;

  survey.content.sections.forEach((section, index) => {
    text += `${index + 1}. ${section.title.toUpperCase()}\n`;
    text += `${'-'.repeat(80)}\n`;
    text += `${section.content}\n\n`;
  });

  text += `CONCLUSION\n${'-'.repeat(80)}\n${survey.content.conclusion}\n\n`;

  text += `REFERENCES\n${'-'.repeat(80)}\n`;
  survey.content.references.forEach((ref, index) => {
    text += `[${index + 1}] ${ref.authors.join(', ')} (${ref.year}). ${ref.title}. ${ref.venue}.\n`;
  });

  return text;
}
