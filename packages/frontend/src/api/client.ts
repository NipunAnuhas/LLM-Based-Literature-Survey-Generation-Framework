// Canonical types + a single fetch wrapper. All pages should import from here.

export type WorkflowStatus =
  | 'initiated'
  | 'query_expansion'
  | 'retrieval'
  | 'validation'
  | 'evaluation'
  | 'synthesis'
  | 'complete'
  | 'error';

export interface Reference {
  authors: string[];
  year: number;
  title: string;
  venue: string;
  url?: string;
  abstract?: string;
  reasonForSelection?: string;
}

export interface SurveySection {
  title: string;
  content: string;
  paperIds?: string[];
}

export interface Survey {
  id: string;
  executionId?: string;
  topic: string;
  content: {
    introduction: string;
    sections: SurveySection[];
    conclusion: string;
    references: Reference[];
  };
  metadata: {
    paperCount: number;
    wordCount: number;
    generatedAt: string;
    themes?: string[];
  };
}

export interface CreateSurveyRequest {
  topic: string;
  options?: {
    maxPapers?: number;
    minCitationCount?: number;
    yearRange?: { start: number; end: number };
  };
}

export interface CreateSurveyResponse {
  executionId: string;
  status: string;
  message: string;
}

export interface WorkflowStatusResponse {
  executionId: string;
  status: WorkflowStatus;
  currentStage?: string;
  progress: number;
  message: string;
  surveyId?: string;
  error?: {
    stage: string;
    message: string;
    retryable: boolean;
  };
}

export interface SurveyResponse {
  survey: Survey;
}

const RAW_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
const API_BASE_URL = `${RAW_BASE.replace(/\/$/, '')}/api`;

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error?.message || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const apiClient = {
  createSurvey: (data: CreateSurveyRequest) =>
    request<CreateSurveyResponse>('/surveys', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getSurveyStatus: (executionId: string) =>
    request<WorkflowStatusResponse>(`/surveys/${executionId}/status`),

  getSurvey: (surveyId: string) =>
    request<SurveyResponse>(`/surveys/${surveyId}`),

  exportSurvey: async (
    surveyId: string,
    format: 'pdf' | 'docx' | 'json'
  ): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/surveys/${surveyId}/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format }),
    });
    if (!response.ok) {
      throw new Error('Export failed');
    }
    return response.blob();
  },
};
