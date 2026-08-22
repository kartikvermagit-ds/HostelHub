import app from './app.js';
import { env } from './config/env.js';
import { checkDatabaseConnection } from './config/database.js';
import { logger } from './utils/logger.js';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Verify database connection
    await checkDatabaseConnection();

    // 2. Start HTTP listener
    const server = app.listen(PORT, () => {
      logger.info(`🚀 HostelHub Server running in [${env.NODE_ENV}] mode on port ${PORT}`);
      logger.info(`📡 API Base URL: http://localhost:${PORT}${env.API_PREFIX}`);
      logger.info(`🩺 Health Check: http://localhost:${PORT}${env.API_PREFIX}/health`);
    });

    // 3. Graceful Shutdown Handlers
    const shutdown = (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });

      // Force close after 10s if remaining connections hang
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at Promise', { reason });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception thrown', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to initialize server', error);
    process.exit(1);
  }
};

startServer();
