/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * HealthGluco - Full-Stack Express Server with Vite Middleware & API Proxy
 * Runs on Port 3000 (Host 0.0.0.0)
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api.js';

// Robust path handling for both ESM and CJS
const currentDirname = process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON & URL-encoded bodies
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // CORS headers for API accessibility
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Mount API routes FIRST
  app.use('/api/v1', apiRouter);

  // Health fallback
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'HealthGluco API v1.0.0' });
  });

  // Vite middleware for development vs Production static dist serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support Express SPA routing fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=============================================================`);
    console.log(`🏥 HealthGluco Production-Ready Full-Stack Server Running`);
    console.log(`🌐 Server Address : http://0.0.0.0:${PORT}`);
    console.log(`⚙️  API Endpoint   : http://0.0.0.0:${PORT}/api/v1`);
    console.log(`🧠 ML XGBoost     : Decision Threshold 0.10 (10%) Active`);
    console.log(`=============================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
