/**
 * API flow: POST /api/surveys → poll status → GET survey.
 * n8n is mocked so tests do not call the real webhook.
 */
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'aaaaaaaa-bbbb-4ccc-bddd-eeeeeeeeeeee'),
}));

jest.mock('./services/n8nService', () => ({
  triggerWorkflow: jest.fn(),
}));

import request from 'supertest';
import app from './app';
import * as n8nService from './services/n8nService';
import { closePool } from './config/database';

afterAll(async () => {
  await closePool();
});

function mockSurveyPayload() {
  return {
    content: {
      introduction: 'Test introduction for integration.',
      sections: [
        {
          title: 'Theme',
          content: 'Theme discussion.',
          paperIds: [] as string[],
        },
      ],
      conclusion: 'Test conclusion.',
      references: [
        {
          authors: ['A. Researcher'],
          year: 2026,
          title: 'Important Study',
          venue: 'Journal',
        },
      ],
    },
    metadata: {
      paperCount: 1,
      wordCount: 20,
      generatedAt: new Date().toISOString(),
      themes: ['test'],
    },
  };
}

describe('Survey API integration (mocked n8n)', () => {
  beforeEach(() => {
    (n8nService.triggerWorkflow as jest.Mock).mockResolvedValue({
      success: true,
      survey: mockSurveyPayload(),
    });
  });

  it('POST /api/surveys returns executionId; status becomes complete; GET returns survey', async () => {
    const create = await request(app)
      .post('/api/surveys')
      .send({ topic: 'Machine learning in healthcare' })
      .set('Content-Type', 'application/json');

    expect(create.status).toBe(201);
    const { executionId } = create.body;
    expect(executionId).toBeDefined();

    let surveyId: string | undefined;
    for (let i = 0; i < 80; i++) {
      await new Promise((r) => setTimeout(r, 50));
      const st = await request(app).get(`/api/surveys/${executionId}/status`);
      if (st.body.status === 'complete' && st.body.surveyId) {
        surveyId = st.body.surveyId;
        break;
      }
      if (st.body.status === 'error') {
        throw new Error(st.body.error?.message || 'workflow error');
      }
    }

    expect(surveyId).toBeDefined();

    const surveyRes = await request(app).get(`/api/surveys/${surveyId}`);
    expect(surveyRes.status).toBe(200);
    expect(surveyRes.body.survey.topic).toBe('Machine learning in healthcare');
    expect(surveyRes.body.survey.content.introduction).toContain('Test introduction');
    expect(n8nService.triggerWorkflow).toHaveBeenCalledWith(
      expect.objectContaining({
        topic: 'Machine learning in healthcare',
        executionId,
      })
    );
  });
});
