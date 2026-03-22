const API_BASE_URL = 'http://localhost:3000/api';

export interface CreateSurveyRequest {
  topic: string;
  options?: {
    maxPapers?: number;
    minCitationCount?: number;
    yearRange?: {
      start: number;
      end: number;
    };
  };
}

export interface CreateSurveyResponse {
  executionId: string;
  status: string;
  message: string;
}

export interface WorkflowStatusResponse {
  executionId: string;
  status: string;
  currentStage?: string;
  progress: number;
  message: string;
  error?: {
    stage: string;
    message: string;
    retryable: boolean;
  };
}

export interface SurveyResponse {
  survey: {
    id: string;
    topic: string;
    content: {
      introduction: string;
      sections: Array<{
        title: string;
        content: string;
      }>;
      conclusion: string;
      references: Array<{
        authors: string[];
        year: number;
        title: string;
        venue: string;
      }>;
    };
    metadata: {
      paperCount: number;
      wordCount: number;
      generatedAt: string;
    };
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: { message: 'An error occurred' },
        }));
        throw new Error(error.error?.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async createSurvey(data: CreateSurveyRequest): Promise<CreateSurveyResponse> {
    return this.request<CreateSurveyResponse>('/surveys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSurveyStatus(executionId: string): Promise<WorkflowStatusResponse> {
    return this.request<WorkflowStatusResponse>(`/surveys/${executionId}/status`);
  }

  async getSurvey(surveyId: string): Promise<SurveyResponse> {
    return this.request<SurveyResponse>(`/surveys/${surveyId}`);
  }

  async exportSurvey(surveyId: string, format: 'pdf' | 'docx' | 'json'): Promise<Blob> {
    const url = `${this.baseUrl}/surveys/${surveyId}/export`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ format }),
    });

    if (!response.ok) {
      throw new Error('Export failed');
    }

    return await response.blob();
  }
}

export const apiClient = new ApiClient();
