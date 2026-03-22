import dotenv from 'dotenv';
import app from './app';
import { config } from './config';
import { healthCheck } from './config/database';

dotenv.config();

// Check database connection on startup
healthCheck()
  .then((healthy) => {
    if (healthy) {
      console.log('✅ Database connection successful');
    } else {
      console.warn('⚠️  Database connection failed - running in limited mode');
    }
  })
  .catch((err) => {
    console.warn('⚠️  Database not available - running in limited mode');
  });

// Start server
const PORT = config.server.port;
const server = app.listen(PORT, () => {
  console.log('\n🎉 ========================================');
  console.log('🚀 Backend server running successfully!');
  console.log('========================================');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log('========================================');
  console.log('\n📚 API Endpoints:');
  console.log('  POST   /api/surveys              - Create survey');
  console.log('  GET    /api/surveys/:id/status   - Get status');
  console.log('  GET    /api/surveys/:id          - Get survey');
  console.log('  POST   /api/surveys/:id/export   - Export survey');
  console.log('\n✅ Server is ready to accept requests!\n');
});

// Graceful shutdown
const shutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
