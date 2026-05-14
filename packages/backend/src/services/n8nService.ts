import axios from 'axios';
import { Survey, WorkflowOptions } from 'shared';
import { config } from '../config';

interface N8nWorkflowTriggerRequest {
  topic: string;
  executionId: string;
  options?: WorkflowOptions;
}

export interface N8nSurveyPayload {
  content: Survey['content'];
  metadata: Omit<Survey['metadata'], 'generatedAt'> & {
    generatedAt: string | Date;
  };
}

export type N8nTriggerResult =
  | { success: true; survey: N8nSurveyPayload }
  | { success: true; deferred: true }
  | { success: false; error: string };

const N8N_TIMEOUT_MS = 5 * 60 * 1000;
const N8N_ACK_TIMEOUT_MS = 90 * 1000;

export function extractSurvey(raw: unknown): N8nSurveyPayload | null {
  // Unwrap JSON strings (including double-encoded bodies from Respond to Webhook).
  let body: any = raw;
  for (let i = 0; i < 4; i++) {
    if (typeof body !== 'string') break;
    try {
      body = JSON.parse(body);
    } catch {
      return null;
    }
  }

  if (!body || typeof body !== 'object') return null;

  // Shape A — { content, metadata }
  if (body.content?.introduction !== undefined && body.metadata?.generatedAt !== undefined) {
    return body as N8nSurveyPayload;
  }

  // Shape B — { survey: { content, metadata } }
  if (body.survey?.content?.introduction !== undefined) {
    return body.survey as N8nSurveyPayload;
  }

  // Shape C — top-level item array from n8n (e.g. [{ json: { survey: ... } }])
  if (Array.isArray(body) && body[0]?.json?.survey) {
    return body[0].json.survey as N8nSurveyPayload;
  }

  return null;
}

export const triggerWorkflow = async (
  data: N8nWorkflowTriggerRequest
): Promise<N8nTriggerResult> => {
  const webhookUrl =
    config.n8n.webhookUrl || `${config.n8n.url}/webhook/survey-workflow`;

  const useCallbackCompletion = config.n8n.completionMode === 'callback';

  console.log('Triggering n8n workflow:', {
    url: webhookUrl,
    executionId: data.executionId,
    topic: data.topic,
    completionMode: config.n8n.completionMode,
  });

  try {
    const response = await axios.post(webhookUrl, data, {
      headers: { 'Content-Type': 'application/json' },
      timeout: useCallbackCompletion ? N8N_ACK_TIMEOUT_MS : N8N_TIMEOUT_MS,
      responseType: 'text',
      transformResponse: [(raw) => {
        if (!raw || raw.trim() === '') return null;
        try { return JSON.parse(raw); } catch { return raw; }
      }],
    });

    console.log('n8n raw response type:', typeof response.data,
      '| keys:', response.data && typeof response.data === 'object' && !Array.isArray(response.data)
        ? Object.keys(response.data as object).join(', ')
        : String(response.data).substring(0, 100));

    const survey = extractSurvey(response.data);

    const ack =
      response.data &&
      typeof response.data === 'object' &&
      (response.data as { accepted?: boolean }).accepted === true;

    if (ack && !survey) {
      if (useCallbackCompletion) {
        console.log(
          'n8n returned async ack; waiting for POST /api/surveys/:executionId/complete'
        );
        return { success: true, deferred: true };
      }
      return {
        success: false,
        error:
          'n8n returned an async ack only. Set N8N_COMPLETION_MODE=callback on the backend, or remove the early Acknowledge step from the workflow for sync mode.',
      };
    }

    if (!survey) {
      console.error('n8n response shape not recognised:', JSON.stringify(response.data)?.substring(0, 300));
      return {
        success: false,
        error: 'n8n response did not include a survey object with content + metadata',
      };
    }

    return { success: true, survey };
  } catch (error: any) {
    const message =
      error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT'
        ? 'n8n service not reachable'
        : error.response?.data?.message || error.message || 'Unknown n8n error';
    console.error('n8n workflow trigger failed:', message);
    return { success: false, error: message };
  }
};
