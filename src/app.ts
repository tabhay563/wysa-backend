import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSwagger } from './utils/swagger';
import { errorHandler } from './utils/errorHandler';
import logger from './utils/logger';
import authRoutes from './routes/authRoutes';
import onboardingRoutes from './routes/onboardingRoutes';
import statsRoutes from './routes/statsRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://wysa-frontend-rouge.vercel.app',
        'https://api.tabhay.tech'
      ]
    : true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/user', userRoutes);

setupSwagger(app);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Wysa Sleep Onboarding API',
    version: '1.0.0',
    docs: '/docs',
    endpoints: {
      auth: '/api/auth',
      onboarding: '/api/onboarding',
      analytics: '/api/stats',
      user: '/api/user'
    }
  });
});

app.use(errorHandler as any);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`API Documentation: http://localhost:${PORT}/docs`);
  });
}

export default app; 