import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite-setup.js";
import { AdminAuthService } from "./admin-auth.js";
import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();

import cors from 'cors';

app.use(cors({
  origin: [
    'https://100-000-ide.vercel.app',  // your Vercel frontend URL
    'http://localhost:5173',            // local dev
    'http://localhost:5000',
  ],
  credentials: true,  // needed for cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
AdminAuthService.initializeAdminUsers();

// Trust proxy for proper IP handling in production
app.set('trust proxy', 1);

// Enable gzip compression for better performance
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6, // Good balance between compression and CPU usage
}));

// Optimize JSON parsing
app.use(express.json({ limit: '10mb' })); // Set reasonable limit
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Cookie parser for admin authentication
app.use(cookieParser());

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Cache static assets
  if (req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  } else {
    // importantly only setup vite in development and before
    // setting up all the other routes so vite middleware has priority
    await setupVite(app, server);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, () => {
    log(`serving on port ${port}`);
  });
})();
