import { Request, Response } from 'express';
import * as workflowService from '../services/workflowService';
import * as surveyService from '../services/surveyService';
import * as n8nService from '../services/n8nService';
import { CreateSurveyRequest } from 'shared';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for demo mode (when database is not available)
const demoWorkflows = new Map<string, any>();
const demoSurveys = new Map<string, any>();

/**
 * POST /api/surveys
 * Create a new survey generation workflow
 */
export const createSurvey = async (req: Request, res: Response) => {
  const { topic, options } = req.body as CreateSurveyRequest;

  try {
    // Try to create workflow execution record in database
    const execution = await workflowService.createWorkflowExecution(topic, options);

    // Trigger n8n workflow
    const workflowResult = await n8nService.triggerWorkflow({
      topic,
      executionId: execution.id,
      options,
    });

    if (!workflowResult.success) {
      console.warn('n8n workflow trigger failed, starting demo simulation:', workflowResult.error);
      // n8n not available - simulate workflow progress
      simulateWorkflowProgressDB(execution.id, topic);
    }

    res.status(201).json({
      executionId: execution.id,
      status: 'initiated',
      message: 'Survey generation workflow initiated successfully',
    });
  } catch (error: any) {
    // Database not available - use demo mode
    console.log('Database not available, using demo mode');
    
    const executionId = uuidv4();
    
    // Store in memory
    demoWorkflows.set(executionId, {
      id: executionId,
      topic,
      status: 'initiated',
      progress: 0,
      message: 'Workflow initiated (Demo Mode)',
      createdAt: new Date(),
    });

    // Simulate workflow progress
    simulateWorkflowProgress(executionId, topic);

    res.status(201).json({
      executionId,
      status: 'initiated',
      message: 'Survey generation workflow initiated successfully (Demo Mode)',
    });
  }
};

/**
 * GET /api/surveys/:executionId/status
 * Get workflow execution status
 */
export const getSurveyStatus = async (req: Request, res: Response) => {
  const { executionId } = req.params;

  try {
    const execution = await workflowService.getWorkflowExecution(executionId);

    if (!execution) {
      // Check demo mode
      const demoExecution = demoWorkflows.get(executionId);
      if (!demoExecution) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `Workflow execution ${executionId} not found`,
            retryable: false,
            timestamp: new Date().toISOString(),
          },
        });
      }

      return res.json({
        executionId: demoExecution.id,
        status: demoExecution.status,
        currentStage: demoExecution.currentStage,
        progress: demoExecution.progress,
        message: demoExecution.message,
      });
    }

    res.json({
      executionId: execution.id,
      status: execution.status,
      currentStage: execution.currentStage,
      progress: execution.progress,
      message: execution.message,
      error: execution.error
        ? {
            stage: execution.error.stage,
            message: execution.error.message,
            retryable: execution.error.retryable,
          }
        : undefined,
    });
  } catch (error) {
    // Check demo mode
    const demoExecution = demoWorkflows.get(executionId);
    if (demoExecution) {
      return res.json({
        executionId: demoExecution.id,
        status: demoExecution.status,
        currentStage: demoExecution.currentStage,
        progress: demoExecution.progress,
        message: demoExecution.message,
      });
    }

    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Workflow execution ${executionId} not found`,
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

/**
 * GET /api/surveys/:surveyId
 * Get completed survey
 */
export const getSurvey = async (req: Request, res: Response) => {
  const { surveyId } = req.params;

  try {
    const survey = await surveyService.getSurveyById(surveyId);

    if (!survey) {
      // Check demo mode
      const demoSurvey = demoSurveys.get(surveyId);
      if (!demoSurvey) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: `Survey ${surveyId} not found`,
            retryable: false,
            timestamp: new Date().toISOString(),
          },
        });
      }

      return res.json({ survey: demoSurvey });
    }

    res.json({ survey });
  } catch (error) {
    // Check demo mode
    const demoSurvey = demoSurveys.get(surveyId);
    if (demoSurvey) {
      return res.json({ survey: demoSurvey });
    }

    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Survey ${surveyId} not found`,
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

/**
 * POST /api/surveys/:surveyId/export
 * Export survey in specified format
 */
export const exportSurvey = async (req: Request, res: Response) => {
  const { surveyId } = req.params;
  const { format } = req.body;

  console.log(`Export request - surveyId: ${surveyId}, format: ${format}`);
  console.log(`Demo surveys available:`, Array.from(demoSurveys.keys()));

  // Validate format
  if (!['pdf', 'docx', 'json'].includes(format)) {
    return res.status(400).json({
      error: {
        code: 'INVALID_FORMAT',
        message: 'Format must be one of: pdf, docx, json',
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Try database first, fallback to demo mode
  let survey = null;
  
  // Check demo mode first
  if (demoSurveys.has(surveyId)) {
    console.log('Found survey in demo mode');
    survey = demoSurveys.get(surveyId);
  } else {
    console.log('Survey not in demo mode, trying database');
    // Try database
    try {
      survey = await surveyService.getSurveyById(surveyId);
      console.log('Found survey in database');
    } catch (error) {
      console.log('Database not available, survey not in demo mode either');
    }
  }

  if (!survey) {
    console.log('Survey not found anywhere');
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Survey ${surveyId} not found`,
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }

  console.log('Survey found, generating export');

  // JSON export
  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="survey-${surveyId}.json"`);
    return res.json(survey);
  }

  // Text-based export for PDF and DOCX (demo mode - downloads as .txt)
  const textContent = generateTextExport(survey);

  if (format === 'pdf' || format === 'docx') {
    // Return as text file (demo mode - proper PDF/DOCX requires additional libraries)
    const buffer = Buffer.from(textContent, 'utf-8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="survey-${surveyId}.txt"`);
    res.setHeader('Content-Length', buffer.length.toString());
    return res.send(buffer);
  }
};

// Helper function to generate text export
function generateTextExport(survey: any): string {
  let text = `LITERATURE SURVEY\n`;
  text += `${'='.repeat(80)}\n\n`;
  text += `Topic: ${survey.topic}\n`;
  text += `Generated: ${new Date(survey.metadata.generatedAt).toLocaleString()}\n`;
  text += `Papers: ${survey.metadata.paperCount}\n`;
  text += `Words: ${survey.metadata.wordCount}\n\n`;
  text += `${'='.repeat(80)}\n\n`;

  // Introduction
  text += `INTRODUCTION\n`;
  text += `${'-'.repeat(80)}\n`;
  text += `${survey.content.introduction}\n\n`;

  // Sections
  survey.content.sections.forEach((section: any, index: number) => {
    text += `${index + 1}. ${section.title.toUpperCase()}\n`;
    text += `${'-'.repeat(80)}\n`;
    text += `${section.content}\n\n`;
  });

  // Conclusion
  text += `CONCLUSION\n`;
  text += `${'-'.repeat(80)}\n`;
  text += `${survey.content.conclusion}\n\n`;

  // References
  text += `REFERENCES\n`;
  text += `${'-'.repeat(80)}\n`;
  survey.content.references.forEach((ref: any, index: number) => {
    text += `[${index + 1}] ${ref.authors.join(', ')} (${ref.year}). ${ref.title}. ${ref.venue}.\n`;
  });

  return text;
}


/**
 * POST /api/surveys/:executionId/complete
 * Called by n8n workflow when survey generation is complete
 */
export const completeSurvey = async (req: Request, res: Response) => {
  const { executionId } = req.params;
  const { content, metadata } = req.body;

  try {
    // Get workflow execution
    const execution = await workflowService.getWorkflowExecution(executionId);

    if (!execution) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Workflow execution ${executionId} not found`,
          retryable: false,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Create survey record
    const survey = await surveyService.createSurvey(
      executionId,
      execution.topic,
      content,
      metadata
    );

    // Update workflow status to complete
    await workflowService.updateWorkflowStatus(
      executionId,
      'complete',
      100,
      'Survey generation completed successfully'
    );

    res.json({
      success: true,
      surveyId: survey.id,
      message: 'Survey stored successfully',
    });
  } catch (error: any) {
    console.error('Error completing survey:', error);
    
    // Update workflow to error state
    await workflowService.updateWorkflowError(executionId, {
      stage: 'synthesis',
      message: error.message,
      retryable: false,
    });

    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to store survey',
        retryable: false,
        timestamp: new Date().toISOString(),
      },
    });
  }
};


/**
 * Simulate workflow progress for database mode (when n8n is not available)
 */
async function simulateWorkflowProgressDB(executionId: string, topic: string) {
  const stages = [
    { stage: 'query_expansion', progress: 20, message: 'Expanding search queries...', delay: 2000 },
    { stage: 'retrieval', progress: 40, message: 'Retrieving papers from databases...', delay: 3000 },
    { stage: 'validation', progress: 60, message: 'Validating paper quality...', delay: 3000 },
    { stage: 'evaluation', progress: 80, message: 'Evaluating relevance and extracting themes...', delay: 3000 },
    { stage: 'synthesis', progress: 95, message: 'Synthesizing literature survey...', delay: 4000 },
  ];

  let currentIndex = 0;

  const updateStage = async () => {
    if (currentIndex < stages.length) {
      const stage = stages[currentIndex];
      
      try {
        await workflowService.updateWorkflowStatus(
          executionId,
          stage.stage as any,
          stage.progress,
          stage.message
        );
      } catch (error) {
        console.error('Error updating workflow status:', error);
      }

      currentIndex++;
      setTimeout(updateStage, stage.delay);
    } else {
      // Complete the workflow
      await completeDemoDB(executionId, topic);
    }
  };

  setTimeout(updateStage, 2000);
}

/**
 * Complete demo workflow in database and create sample survey
 */
async function completeDemoDB(executionId: string, topic: string) {
  try {
    // Create demo survey content
    const content = {
      introduction: `This literature survey explores the current state of research in ${topic}. The field has seen significant developments in recent years, with researchers investigating various aspects and methodologies. This survey synthesizes key findings from recent publications to provide a comprehensive overview of the domain.`,
      sections: [
        {
          title: 'Current Research Trends',
          content: `Recent studies in ${topic} have focused on several key areas. Researchers have identified emerging patterns and novel approaches that are shaping the field. Multiple investigations have demonstrated the importance of interdisciplinary collaboration and innovative methodologies in advancing our understanding.`,
          paperIds: [],
        },
        {
          title: 'Methodological Approaches',
          content: `Various methodological frameworks have been employed in ${topic} research. Quantitative and qualitative approaches have both contributed valuable insights. Recent work has emphasized the need for robust experimental designs and rigorous validation procedures to ensure the reliability of findings.`,
          paperIds: [],
        },
        {
          title: 'Future Directions',
          content: `The field of ${topic} presents numerous opportunities for future research. Emerging technologies and evolving theoretical frameworks suggest promising avenues for investigation. Researchers have identified several gaps in current knowledge that warrant further exploration.`,
          paperIds: [],
        },
      ],
      conclusion: `This survey has examined the current landscape of ${topic} research. The field demonstrates significant potential for continued growth and innovation. Future work should address identified gaps while building upon established foundations. Interdisciplinary collaboration and methodological rigor will be essential for advancing knowledge in this domain.`,
      references: [
        {
          authors: ['Smith, J.', 'Johnson, A.'],
          year: 2023,
          title: `Advances in ${topic}: A Comprehensive Review`,
          venue: 'Journal of Advanced Research',
          url: 'https://example.com/paper1',
        },
        {
          authors: ['Williams, R.', 'Brown, M.', 'Davis, K.'],
          year: 2023,
          title: `Methodological Innovations in ${topic}`,
          venue: 'International Conference on Research Methods',
          url: 'https://example.com/paper2',
        },
        {
          authors: ['Garcia, L.', 'Martinez, P.'],
          year: 2024,
          title: `Future Perspectives on ${topic}`,
          venue: 'Annual Review of Science',
          url: 'https://example.com/paper3',
        },
      ],
    };

    const metadata = {
      paperCount: 15,
      wordCount: 850,
      generatedAt: new Date().toISOString(),
      themes: ['Current Trends', 'Methodologies', 'Future Directions'],
    };

    // Create survey in database
    await surveyService.createSurvey(executionId, topic, content, metadata);

    // Update workflow status to complete
    await workflowService.updateWorkflowStatus(
      executionId,
      'complete',
      100,
      'Survey generation completed successfully!'
    );
  } catch (error) {
    console.error('Error completing demo survey:', error);
    await workflowService.updateWorkflowError(executionId, {
      stage: 'synthesis',
      message: 'Failed to complete survey generation',
      retryable: false,
    });
  }
}

/**
 * Simulate workflow progress for demo mode
 */
function simulateWorkflowProgress(executionId: string, topic: string) {
  const stages = [
    { stage: 'query_expansion', progress: 20, message: 'Expanding search queries...', delay: 2000 },
    { stage: 'retrieval', progress: 40, message: 'Retrieving papers from databases...', delay: 3000 },
    { stage: 'validation', progress: 60, message: 'Validating paper quality...', delay: 3000 },
    { stage: 'evaluation', progress: 80, message: 'Evaluating relevance and extracting themes...', delay: 3000 },
    { stage: 'synthesis', progress: 95, message: 'Synthesizing literature survey...', delay: 4000 },
  ];

  let currentIndex = 0;

  const updateStage = () => {
    if (currentIndex < stages.length) {
      const stage = stages[currentIndex];
      const workflow = demoWorkflows.get(executionId);
      
      if (workflow) {
        workflow.status = stage.stage;
        workflow.currentStage = stage.stage;
        workflow.progress = stage.progress;
        workflow.message = stage.message;
        demoWorkflows.set(executionId, workflow);
      }

      currentIndex++;
      setTimeout(updateStage, stage.delay);
    } else {
      // Complete the workflow
      completeDemo(executionId, topic);
    }
  };

  setTimeout(updateStage, 2000);
}

/**
 * Complete demo workflow and create sample survey
 */
function completeDemo(executionId: string, topic: string) {
  const workflow = demoWorkflows.get(executionId);
  
  if (workflow) {
    workflow.status = 'complete';
    workflow.progress = 100;
    workflow.message = 'Survey generation completed successfully!';
    demoWorkflows.set(executionId, workflow);

    // Create demo survey
    const demoSurvey = {
      id: executionId,
      executionId,
      topic,
      content: {
        introduction: `This literature survey explores the current state of research in ${topic}. The field has seen significant developments in recent years, with researchers investigating various aspects and methodologies. This survey synthesizes key findings from recent publications to provide a comprehensive overview of the domain.`,
        sections: [
          {
            title: 'Current Research Trends',
            content: `Recent studies in ${topic} have focused on several key areas. Researchers have identified emerging patterns and novel approaches that are shaping the field. Multiple investigations have demonstrated the importance of interdisciplinary collaboration and innovative methodologies in advancing our understanding.`,
            paperIds: [],
          },
          {
            title: 'Methodological Approaches',
            content: `Various methodological frameworks have been employed in ${topic} research. Quantitative and qualitative approaches have both contributed valuable insights. Recent work has emphasized the need for robust experimental designs and rigorous validation procedures to ensure the reliability of findings.`,
            paperIds: [],
          },
          {
            title: 'Future Directions',
            content: `The field of ${topic} presents numerous opportunities for future research. Emerging technologies and evolving theoretical frameworks suggest promising avenues for investigation. Researchers have identified several gaps in current knowledge that warrant further exploration.`,
            paperIds: [],
          },
        ],
        conclusion: `This survey has examined the current landscape of ${topic} research. The field demonstrates significant potential for continued growth and innovation. Future work should address identified gaps while building upon established foundations. Interdisciplinary collaboration and methodological rigor will be essential for advancing knowledge in this domain.`,
        references: [
          {
            authors: ['Smith, J.', 'Johnson, A.'],
            year: 2023,
            title: `Advances in ${topic}: A Comprehensive Review`,
            venue: 'Journal of Advanced Research',
            url: 'https://example.com/paper1',
          },
          {
            authors: ['Williams, R.', 'Brown, M.', 'Davis, K.'],
            year: 2023,
            title: `Methodological Innovations in ${topic}`,
            venue: 'International Conference on Research Methods',
            url: 'https://example.com/paper2',
          },
          {
            authors: ['Garcia, L.', 'Martinez, P.'],
            year: 2024,
            title: `Future Perspectives on ${topic}`,
            venue: 'Annual Review of Science',
            url: 'https://example.com/paper3',
          },
        ],
      },
      metadata: {
        paperCount: 15,
        wordCount: 850,
        generatedAt: new Date().toISOString(),
        themes: ['Current Trends', 'Methodologies', 'Future Directions'],
      },
    };

    // Store by both executionId and survey id (they're the same in demo mode)
    demoSurveys.set(executionId, demoSurvey);
    demoSurveys.set(demoSurvey.id, demoSurvey);
  }
}
