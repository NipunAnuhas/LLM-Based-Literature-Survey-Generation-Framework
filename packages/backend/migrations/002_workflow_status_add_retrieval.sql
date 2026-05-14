-- Allow 'retrieval' in workflow_executions.status (must match shared WorkflowStatus + simulator stages).

ALTER TABLE workflow_executions DROP CONSTRAINT IF EXISTS workflow_executions_status_check;

ALTER TABLE workflow_executions ADD CONSTRAINT workflow_executions_status_check CHECK (status IN (
  'initiated',
  'query_expansion',
  'retrieval',
  'validation',
  'evaluation',
  'synthesis',
  'complete',
  'error'
));

COMMENT ON COLUMN workflow_executions.status IS 'Current workflow status: initiated, query_expansion, retrieval, validation, evaluation, synthesis, complete, error';
