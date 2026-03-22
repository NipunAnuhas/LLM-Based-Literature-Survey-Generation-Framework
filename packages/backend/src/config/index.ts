import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'literature_survey',
    user: process.env.DB_USER || 'litsurvey',
    password: process.env.DB_PASSWORD || 'litsurvey_dev_password',
  },
  n8n: {
    url: process.env.N8N_URL || 'http://localhost:5678',
    apiKey: process.env.N8N_API_KEY || '',
    webhookUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/survey-workflow',
  },
  llm: {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  },
  scholarly: {
    semanticScholarApiKey: process.env.SEMANTIC_SCHOLAR_API_KEY || '',
    arxivApiBaseUrl: process.env.ARXIV_API_BASE_URL || 'http://export.arxiv.org/api/query',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
