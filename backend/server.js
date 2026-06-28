import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDatabase } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Resolve directory paths in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // Enable all origins for development and testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Database bootstrap connection
try {
  console.log('Connecting to database...');
  await getDatabase();
} catch (error) {
  console.error('Fatal database startup failure, exiting backend process:', error);
  process.exit(1);
}

// Bind API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve frontend static assets in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  
  // Custom SPA catch-all middleware for client-side routing
  app.get('*', (req, res, next) => {
    // Pass API requests to the 404 handler
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Base route info for development
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Sri Venkata Sai Furniture Works API Portal',
      status: 'online',
      version: '1.0.0'
    });
  });
}

// 404 Route handler (for API or unhandled paths in development)
app.use((req, res) => {
  res.status(404).json({ message: `API route ${req.originalUrl} not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  SVS Furniture Works Server running on port ${PORT} `);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`  Local URL: http://localhost:${PORT} `);
  console.log(`==================================================`);
});
