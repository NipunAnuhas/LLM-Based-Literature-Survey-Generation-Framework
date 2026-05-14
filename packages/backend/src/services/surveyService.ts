import { query } from '../config/database';
import { Survey } from 'shared';

export const getSurveyById = async (surveyId: string): Promise<Survey | null> => {
  const result = await query(`SELECT * FROM surveys WHERE id = $1`, [surveyId]);

  if (result.rows.length === 0) {
    return null;
  }

  return mapRowToSurvey(result.rows[0]);
};

export const getSurveyByExecutionId = async (
  executionId: string
): Promise<Survey | null> => {
  const result = await query(`SELECT * FROM surveys WHERE execution_id = $1`, [executionId]);

  if (result.rows.length === 0) {
    return null;
  }

  return mapRowToSurvey(result.rows[0]);
};

export const createSurvey = async (
  executionId: string,
  topic: string,
  content: any,
  metadata: any
): Promise<Survey> => {
  const result = await query(
    `INSERT INTO surveys (execution_id, topic, content, metadata)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [executionId, topic, JSON.stringify(content), JSON.stringify(metadata)]
  );

  return mapRowToSurvey(result.rows[0]);
};

function mapRowToSurvey(row: any): Survey {
  return {
    id: row.id,
    executionId: row.execution_id,
    topic: row.topic,
    content: row.content,
    metadata: {
      ...row.metadata,
      generatedAt: new Date(row.metadata.generatedAt || row.created_at),
    },
  };
}
