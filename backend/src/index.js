import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import habitsRoutes from './routes/habitsRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// dotenv.config() is now handled by the import above

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/integrations', integrationRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Habit Tracker API is running 🚀' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
