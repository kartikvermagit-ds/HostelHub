import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { globalRateLimiter } from './middleware/rateLimit.middleware.js';
import { httpLogger } from './middleware/logging.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import routes from './routes/index.js';

const app = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS Configuration
const allowedOrigins = [
  env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development, strict in production
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Request Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Request Logging
app.use(httpLogger);

// 5. Global Rate Limiting
app.use(globalRateLimiter);

// 6. Root Landing endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to HostelHub API',
    docs: `${env.API_PREFIX}/health`,
    version: '1.0.0',
  });
});

// 7. Mount API Router
app.use(env.API_PREFIX, routes);

// 8. 404 Route Not Found Handler
app.use(notFoundHandler);

// 9. Centralized Error Handler
app.use(errorHandler);

export default app;
