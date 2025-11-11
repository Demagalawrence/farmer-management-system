import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/db';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';
import { backupService } from './utils/backup';

// Import routes
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import farmerRoutes from './routes/farmerRoutes';
import fieldRoutes from './routes/fieldRoutes';
import harvestRoutes from './routes/harvestRoutes';
import paymentRoutes from './routes/paymentRoutes';
import reportRoutes from './routes/reportRoutes';
import searchRoutes from './routes/searchRoutes';
import financeRoutes from './routes/financeRoutes';
import accessCodeRoutes from './routes/accessCodeRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: any) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Schedule automatic backups (daily at 2 AM)
    if (process.env.ENABLE_AUTO_BACKUP === 'true') {
      backupService.scheduleAutoBackup('0 2 * * *');
      logger.info('Automatic backups scheduled');
    }
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB:', error);
    logger.warn('Please ensure MongoDB is installed and running on your system.');
    logger.warn('Visit https://docs.mongodb.com/manual/installation/ for installation instructions.');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/harvests', harvestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/access-codes', accessCodeRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler - Express 5.x syntax
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware - must be last
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info('MongoDB connection status: Check console logs above');
});

export default app;