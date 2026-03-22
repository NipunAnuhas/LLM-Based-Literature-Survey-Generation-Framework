import { query } from '../config/database';
import { WorkflowExecution, WorkflowOptions, WorkflowStatus } from 'shared';

/**
 * Create a new workflow execution
 */
export const createWorkflowExecution = async (
  topic: string,
  options: WorkflowOptions = {}
): Promise<WorkflowExecution> => {
  const result = await query(
    `INSERT INTO workflow_executions (topic, status, progress, message, options)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [topic, 'initiated', 0, 'Workflow initiated', JSON.stringify(options)]
  );

  const row = result.rows[0];
  return mapRowToWorkflowExecution(row);
};

/**
 * Get workflow execution by ID
 */
export const getWorkflowExecution = async (
  executionId: string
): Promise<WorkflowExecution | null> => {
  const result = await query(
    `SELECT * FROM workflow_executions WHERE id = $1`,
    [executionId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapRowToWorkflowExecution(result.rows[0]);
};

/**
 * Update workflow execution status
 */
export const updateWorkflowStatus = async (
  executionId: string,
  status: WorkflowStatus,
  progress: number,
  message: string,
  currentStage?: string
): Promise<WorkflowExecution> => {
  const completedAt = status === 'complete' || status === 'error' ? new Date() : null;

  const result = await query(
    `UPDATE workflow_executions
     SET status = $1, progress = $2, message = $3, current_stage = $4, completed_at = $5, updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [status, progress, message, currentStage, completedAt, executionId]
  );

  if (result.rows.length === 0) {
    throw new Error(`Workflow execution ${executionId} not found`);
  }

  return mapRowToWorkflowExecution(result.rows[0]);
};

/**
 * Update workflow error
 */
export const updateWorkflowError = async (
  executionId: string,
  error: {
    stage: string;
    message: string;
    retryable: boolean;
  }
): Promise<void> => {
  await query(
    `UPDATE workflow_executions
     SET status = 'error', error = $1, updated_at = NOW(), completed_at = NOW()
     WHERE id = $2`,
    [JSON.stringify({ ...error, timestamp: new Date() }), executionId]
  );
};

/**
 * Map database row to WorkflowExecution object
 */
function mapRowToWorkflowExecution(row: any): WorkflowExecution {
  return {
    id: row.id,
    topic: row.topic,
    status: row.status,
    currentStage: row.current_stage,
    progress: row.progress,
    message: row.message,
    options: row.options || {},
    error: row.error,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
  };
}
