// Core domain models

export interface Author {
  name: string;
  affiliations?: string[];
}

export interface Paper {
  id: string;
  externalId: string;
  title: string;
  authors: Author[];
  abstract: string;
  publicationYear: number;
  citationCount: number;
  venue: string;
  url: string;
  qualityScore?: number; // 0-10
  relevanceScore?: number; // 0-10
  themes?: string[];
}

export interface Reference {
  authors: string[]; // Author names
  year: number;
  title: string;
  venue: string;
  url?: string;
}

export interface SurveySection {
  title: string;
  content: string; // Markdown formatted
  paperIds: string[]; // References to papers
}

export interface Survey {
  id: string;
  executionId: string;
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
    generatedAt: Date;
    themes: string[];
  };
}

export type WorkflowStatus =
  | 'initiated'
  | 'query_expansion'
  | 'validation'
  | 'evaluation'
  | 'synthesis'
  | 'complete'
  | 'error';

export type PipelineStage =
  | 'query_expansion'
  | 'retrieval'
  | 'validation'
  | 'evaluation'
  | 'synthesis';

export interface WorkflowOptions {
  maxPapers?: number;
  minCitationCount?: number;
  yearRange?: {
    start: number;
    end: number;
  };
}

export interface WorkflowError {
  stage: PipelineStage;
  message: string;
  retryable: boolean;
  timestamp: Date;
}

export interface WorkflowExecution {
  id: string;
  topic: string;
  status: WorkflowStatus;
  currentStage?: PipelineStage;
  progress: number;
  message: string;
  options: WorkflowOptions;
  error?: WorkflowError;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// LLM interaction models

export interface LLMRequest {
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface LLMResponse {
  content: string;
  model: string;
  tokensUsed: number;
  finishReason: string;
}

// Export models

export type ExportFormat = 'pdf' | 'docx' | 'json';

export interface ExportRequest {
  surveyId: string;
  format: ExportFormat;
}

export interface ExportResult {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}

// API request/response types

export interface CreateSurveyRequest {
  topic: string;
  options?: WorkflowOptions;
}

export interface CreateSurveyResponse {
  executionId: string;
  status: 'initiated';
  message: string;
}

export interface GetStatusResponse {
  executionId: string;
  status: WorkflowStatus;
  currentStage?: PipelineStage;
  progress: number;
  message: string;
  error?: {
    stage: string;
    message: string;
    retryable: boolean;
  };
}

export interface GetSurveyResponse {
  survey: Survey;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
    timestamp: Date;
  };
}
