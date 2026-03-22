import express from 'express';
import cors from 'cors';
import { requestLogger } from './middleware/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import surveysRouter from './routes/surveys';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Literature Survey System API',
    version: '1.0.0',
    status: 'running',
    message: 'Welcome to the Literature Survey Generation System!',
    endpoints: {
      health: 'GET /health',
      createSurvey: 'POST /api/surveys',
      getSurveyStatus: 'GET /api/surveys/:executionId/status',
      getSurvey: 'GET /api/surveys/:surveyId',
      exportSurvey: 'POST /api/surveys/:surveyId/export',
    },
  });
});

// API routes
app.use('/api/surveys', surveysRouter);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
