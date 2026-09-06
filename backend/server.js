import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import campaignRoutes from './src/routes/campaignRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Al-Barr API Engine is Running Smoothly...');
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 [Server] Running at http://localhost:${PORT}`);
});