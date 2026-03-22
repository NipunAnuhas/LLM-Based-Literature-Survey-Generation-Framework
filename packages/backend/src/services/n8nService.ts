import axios from 'axios';
import { config } from '../config';

interface N8nWorkflowTriggerRequest {
  topic: string;
  executionId: string;
  options?: {
    maxPapers?: number;
    minCitationCount?: number;
    yearRange?: {
      start: number;
      end: number;
    };
  };
}

interface N8nWorkflowResponse {
  success: boolean;
  executionId?: string;
  error?: string;
}

/**
 * Trigger n8n workflow for survey generation
 */
export const triggerWorkflow = async (
  data: N8nWorkflowTriggerRequest
): Promise<N8nWorkflowResponse> => {
  try {
    const webhookUrl = config.n8n.webhookUrl || `${config.n8n.url}/webhook/survey-workflow`;

    console.log('Triggering n8n workflow:', {
      url: webhookUrl,
      executionId: data.executionId,
      topic: data.topic,
    });

    const response = await axios.post(webhookUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout for webhook trigger
    });

    console.log('n8n workflow triggered successfully:', response.data);

    return {
      success: true,
      executionId: data.executionId,
    };
  } catch (error: any) {
    console.error('Failed to trigger n8n workflow:', error.message);

    // Check if n8n is not available
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.warn('n8n service not available - workflow will not execute');
      return {
        success: false,
        error: 'n8n service not available',
      };
    }

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get n8n workflow execution status
 */
export const getWorkflowExecutionStatus = async (
  executionId: string
): Promise<any> => {
  try {
    const apiUrl = `${config.n8n.url}/api/v1/executions/${executionId}`;
    const apiKey = config.n8n.apiKey;

    if (!apiKey) {
      console.warn('n8n API key not configured');
      return null;
    }

    const response = await axios.get(apiUrl, {
      headers: {
        'X-N8N-API-KEY': apiKey,
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error: any) {
    console.error('Failed to get n8n execution status:', error.message);
    return null;
  }
};

/**
 * Cancel n8n workflow execution
 */
export const cancelWorkflowExecution = async (
  executionId: string
): Promise<boolean> => {
  try {
    const apiUrl = `${config.n8n.url}/api/v1/executions/${executionId}/stop`;
    const apiKey = config.n8n.apiKey;

    if (!apiKey) {
      console.warn('n8n API key not configured');
      return false;
    }

    await axios.post(
      apiUrl,
      {},
      {
        headers: {
          'X-N8N-API-KEY': apiKey,
        },
        timeout: 5000,
      }
    );

    console.log('n8n workflow execution cancelled:', executionId);
    return true;
  } catch (error: any) {
    console.error('Failed to cancel n8n execution:', error.message);
    return false;
  }
};
