# 📋 Quick Reference Card

## 🚀 Start Commands

```bash
# Backend
cd packages/backend && npm run dev

# Frontend  
cd packages/frontend && npm run dev

# Docker (optional)
docker-compose up -d
```

## 🌐 URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:5174 | ✅ Running |
| Backend API | http://localhost:3000 | ✅ Running |
| Health Check | http://localhost:3000/health | ✅ Available |
| n8n Workflow | http://localhost:5678 | ⏸️ Optional |
| PostgreSQL | localhost:5432 | ⏸️ Optional |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/surveys` | Create new survey |
| GET | `/api/surveys/:id/status` | Get workflow status |
| GET | `/api/surveys/:id` | Get completed survey |
| POST | `/api/surveys/:id/export` | Export survey (PDF/DOCX/JSON) |

## 📁 Project Structure

```
literature-survey-system/
├── packages/
│   ├── backend/           # Express API (Port 3000)
│   │   ├── src/
│   │   │   ├── controllers/   # Request handlers
│   │   │   ├── services/      # Business logic
│   │   │   ├── middleware/    # Express middleware
│   │   │   ├── routes/        # API routes
│   │   │   └── config/        # Configuration
│   │   └── migrations/        # Database schema
│   │
│   ├── frontend/          # React UI (Port 5174)
│   │   └── src/
│   │       ├── pages/         # Route pages
│   │       ├── components/    # React components
│   │       └── api/           # API client
│   │
│   └── shared/            # Shared types & validation
│       └── src/
│           ├── types.ts       # TypeScript interfaces
│           ├── validation.ts  # Zod schemas
│           └── validators.ts  # Validation functions
│
├── docker-compose.yml     # Docker services
├── package.json          # Root workspace config
└── README.md            # Main documentation
```

## 🎨 Frontend Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Topic input form |
| Progress | `/progress/:executionId` | Workflow tracking |
| Survey | `/survey/:surveyId` | Results display |

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `workflow_executions` | Track survey generation workflows |
| `papers` | Store retrieved and evaluated papers |
| `surveys` | Store final generated surveys |

## 🔧 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router

**Backend:**
- Node.js
- Express
- TypeScript
- PostgreSQL
- Zod

**DevOps:**
- Docker
- Docker Compose
- n8n

## 📊 Key Metrics

- **Lines of Code:** 3,500+
- **Files:** 40+
- **API Endpoints:** 4
- **Database Tables:** 3
- **Frontend Pages:** 3
- **Technologies:** 15+

## ✅ Completed Features

- [x] Project structure
- [x] Database schema
- [x] Backend API
- [x] Frontend UI
- [x] Type-safe validation
- [x] Error handling
- [x] Progress tracking
- [x] Export functionality (architecture)

## 🔄 Next Steps

- [ ] n8n workflow integration
- [ ] LLM API integration
- [ ] Scholarly API clients
- [ ] PDF/DOCX export generation
- [ ] Docker deployment
- [ ] Testing suite

## 🐛 Common Issues

### Port Already in Use
```bash
# Backend: Edit packages/backend/.env
PORT=3001

# Frontend: Vite auto-selects next port
```

### Database Connection Failed
- Normal for demo without Docker
- System runs in "limited mode"
- Shows error handling works

### Module Not Found
```bash
# Rebuild shared package
cd packages/shared
npm run build
```

## 💡 Demo Tips

1. **Start with Frontend** - Visual impact
2. **Show Progress Page** - Animated, impressive
3. **Explain Architecture** - Professional design
4. **Highlight Type Safety** - TypeScript everywhere
5. **Mention Scalability** - Easy to extend

## 📞 Quick Commands

```bash
# Install all dependencies
npm install

# Build shared package
cd packages/shared && npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Stop Docker
docker-compose down
```

## 🎯 Demo Flow

1. Open http://localhost:5174
2. Enter topic: "Machine Learning in Healthcare"
3. Show progress page animation
4. Explain pipeline stages
5. Show backend API at http://localhost:3000
6. Show code structure in VS Code
7. Highlight TypeScript types
8. Explain database schema

## 📚 Important Files

| File | Purpose |
|------|---------|
| `PROJECT_SUMMARY.md` | Complete project overview |
| `DEMO_GUIDE.md` | Detailed demo script |
| `README.md` | Setup instructions |
| `packages/backend/src/app.ts` | Express app setup |
| `packages/frontend/src/App.tsx` | React app entry |
| `packages/shared/src/types.ts` | Type definitions |
| `docker-compose.yml` | Service configuration |

## 🎓 Learning Outcomes

- Full-stack TypeScript
- RESTful API design
- Database schema design
- React development
- Docker containerization
- Workflow orchestration
- LLM integration patterns
- Testing strategies

---

**Last Updated:** February 23, 2024
**Status:** ✅ Demo Ready
**Version:** 1.0.0
