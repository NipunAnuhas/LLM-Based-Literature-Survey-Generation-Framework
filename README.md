# Automated Literature Survey Generation System

A web-based platform that produces comprehensive literature surveys using multiple Large Language Models (LLMs) orchestrated through n8n workflow automation.

## Features

- **Multi-LLM Pipeline**: Uses specialized LLMs for retrieval, validation, evaluation, and summarization
- **Scholarly API Integration**: Retrieves papers from Semantic Scholar and arXiv
- **Real-time Progress Tracking**: Monitor workflow execution stages
- **Export Capabilities**: Generate surveys in PDF, DOCX, and JSON formats
- **Quality Assessment**: Validates papers based on academic metrics
- **Theme-based Organization**: Automatically groups papers by identified themes

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Workflow**: n8n for LLM pipeline orchestration
- **Database**: PostgreSQL
- **Testing**: Jest + fast-check (property-based testing)

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker and Docker Compose

## 🚀 Quick Start

### Current Status: ✅ DEMO READY

Both frontend and backend are fully functional and running!

### Running the Application

```bash
# Terminal 1 - Backend Server
cd packages/backend
npm run dev

# Terminal 2 - Frontend Application
cd packages/frontend
npm run dev
```

**Access Points:**
- 🌐 **Frontend UI:** http://localhost:5174
- 🔌 **Backend API:** http://localhost:3000
- 📊 **API Health:** http://localhost:3000/health

### Optional: Start Docker Services

```bash
# For full database functionality
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- n8n on port 5678 (http://localhost:5678)

**Note:** The system works without Docker for demo purposes!

## Project Structure

```
literature-survey-system/
├── packages/
│   ├── backend/          # Express API server
│   │   ├── src/
│   │   ├── migrations/   # Database migrations
│   │   └── package.json
│   ├── frontend/         # React application
│   │   ├── src/
│   │   └── package.json
│   └── shared/           # Shared types and utilities
│       ├── src/
│       └── package.json
├── docker-compose.yml
└── package.json
```

## Development

### Run Tests

```bash
npm test
```

### Lint Code

```bash
npm run lint
```

### Format Code

```bash
npm run format
```

### Build for Production

```bash
npm run build
```

## API Endpoints

- `POST /api/surveys` - Initiate survey generation
- `GET /api/surveys/:executionId/status` - Get workflow status
- `GET /api/surveys/:surveyId` - Retrieve completed survey
- `POST /api/surveys/:surveyId/export` - Export survey (PDF/DOCX/JSON)

## n8n Workflow

The n8n workflow orchestrates the multi-LLM pipeline:

1. **Query Expansion** - LLM generates search queries
2. **Paper Retrieval** - Queries scholarly APIs
3. **Validation** - LLM assesses paper quality
4. **Evaluation** - LLM scores relevance and extracts themes
5. **Synthesis** - LLM generates literature survey

Access n8n at http://localhost:5678 to view and modify the workflow.

## Environment Variables

See `packages/backend/.env.example` for required configuration:

- Database credentials
- n8n URL and API key
- LLM API keys (OpenAI, Anthropic)
- Scholarly API keys

## Testing Strategy

- **Unit Tests**: Specific examples and edge cases
- **Property-Based Tests**: Universal correctness properties (fast-check)
- **Integration Tests**: Component interactions
- **E2E Tests**: Complete user flows

## License

MIT

## Contributing

This is an academic prototype for final year project demonstration.
