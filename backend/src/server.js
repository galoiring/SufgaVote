import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from './config/environment.js';
import connectDB from './config/database.js';
import { errorHandler } from './utils/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import votingRoutes from './routes/voting.js';
import resultsRoutes from './routes/results.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== Middleware =====
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  if (req.path.includes('/sufganiot')) {
    console.log('🔍 Sufganiot Request:', {
      method: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers['content-type']
    });
  }
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), config.upload.directory)));

// ===== Routes =====
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SufgaVote API',
    version: '1.0.0',
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/voting', votingRoutes);
app.use('/api/results', resultsRoutes);

// ===== Error Handler =====
app.use(errorHandler);

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ===== Start Server =====
const startServer = async () => {
  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), config.upload.directory);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✓ Created uploads directory:', uploadsDir);
    }

    // Connect to MongoDB
    await connectDB();

    // Start listening
    app.listen(config.port, () => {
      console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║           🍩 SufgaVote API Server            ║
║                                               ║
║  Environment: ${config.nodeEnv.padEnd(32)} ║
║  Port:        ${String(config.port).padEnd(32)} ║
║  Database:    MongoDB Atlas ✓                 ║
║                                               ║
║  API:         http://localhost:${config.port}      ║
║  Status:      Ready to accept requests        ║
║                                               ║
╚═══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

startServer();

export default app;
