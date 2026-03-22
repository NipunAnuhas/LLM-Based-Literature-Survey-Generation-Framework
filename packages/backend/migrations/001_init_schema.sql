-- Literature Survey System Database Schema
-- Version: 1.0.0
-- Description: Initial schema for workflow executions, papers, and surveys

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workflow executions table
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN (
    'initiated',
    'query_expansion',
    'validation',
    'evaluation',
    'synthesis',
    'complete',
    'error'
  )),
  current_stage VARCHAR(50) CHECK (current_stage IN (
    'query_expansion',
    'retrieval',
    'validation',
    'evaluation',
    'synthesis'
  )),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  message TEXT,
  options JSONB DEFAULT '{}'::jsonb,
  error JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Papers table (intermediate storage)
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
  external_id VARCHAR(255),
  title TEXT NOT NULL,
  authors JSONB NOT NULL DEFAULT '[]'::jsonb,
  abstract TEXT,
  publication_year INTEGER CHECK (publication_year >= 1900 AND publication_year <= EXTRACT(YEAR FROM NOW())),
  citation_count INTEGER DEFAULT 0 CHECK (citation_count >= 0),
  venue TEXT,
  url TEXT,
  quality_score DECIMAL(3,1) CHECK (quality_score >= 0 AND quality_score <= 10),
  relevance_score DECIMAL(3,1) CHECK (relevance_score >= 0 AND relevance_score <= 10),
  themes JSONB DEFAULT '[]'::jsonb,
  retrieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Surveys table
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID NOT NULL UNIQUE REFERENCES workflow_executions(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  content JSONB NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_executions_status ON workflow_executions(status);
CREATE INDEX idx_executions_created_at ON workflow_executions(created_at DESC);
CREATE INDEX idx_papers_execution ON papers(execution_id);
CREATE INDEX idx_papers_external_id ON papers(external_id);
CREATE INDEX idx_surveys_execution ON surveys(execution_id);
CREATE INDEX idx_surveys_created_at ON surveys(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on workflow_executions
CREATE TRIGGER update_workflow_executions_updated_at
  BEFORE UPDATE ON workflow_executions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE workflow_executions IS 'Stores workflow execution state and progress';
COMMENT ON TABLE papers IS 'Intermediate storage for retrieved and evaluated papers';
COMMENT ON TABLE surveys IS 'Final generated literature surveys';

COMMENT ON COLUMN workflow_executions.status IS 'Current workflow status: initiated, query_expansion, validation, evaluation, synthesis, complete, error';
COMMENT ON COLUMN workflow_executions.progress IS 'Progress percentage (0-100)';
COMMENT ON COLUMN workflow_executions.options IS 'User-provided options: maxPapers, minCitationCount, yearRange';
COMMENT ON COLUMN workflow_executions.error IS 'Error details if workflow fails: stage, message, retryable, timestamp';

COMMENT ON COLUMN papers.quality_score IS 'LLM-assigned quality score (0-10)';
COMMENT ON COLUMN papers.relevance_score IS 'LLM-assigned relevance score (0-10)';
COMMENT ON COLUMN papers.themes IS 'Array of theme strings identified during evaluation';

COMMENT ON COLUMN surveys.content IS 'Survey structure: introduction, sections, conclusion, references';
COMMENT ON COLUMN surveys.metadata IS 'Survey metadata: paperCount, wordCount, generatedAt, themes';
