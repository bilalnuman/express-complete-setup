import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import { errorHandler } from './middlewares/errorHandler';
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const BASE_API_URL = process.env.BASE_API_URL
// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});



// Welcome endpoint
app.get('/api/v1/', (req, res) => {
  res.json({
    message: 'Welcome to First Project API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*'
    }
  });
});

// Api routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);


// If no route match then this action will be execute
app.use('/', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error('Error:', err);

//   // Duplicate key error (PostgreSQL)
//   if (err.code === '23505') {
//     return res.status(400).json({
//       success: false,
//       message: 'Resource already exists',
//     });
//   }

//   // Default error response
//   res.status(err.status || 500).json({
//     success: false,
//     message: process.env.NODE_ENV === 'production'
//       ? 'Internal server error'
//       : err.message,
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// });

export default app;