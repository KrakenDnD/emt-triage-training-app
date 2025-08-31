const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    message: 'EMT Triage Training API is running successfully!',
    uptime: process.uptime()
  });
});

// API welcome endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to EMT Triage Training API',
    version: '0.1.0',
    team: {
      name: '[Team Name]',
      members: [
        'Meghan Lawrence (Frontend Lead & Project Manager)',
        'Sophia Worsham (Backend Lead & AI Integration)',
        'Daniel Hall ([Role] & [Specialization])'
      ]
    },
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth (coming soon)',
      scenarios: '/api/scenarios (coming soon)',
      ai: '/api/ai (coming soon)',
      users: '/api/users (coming soon)',
      analytics: '/api/analytics (coming soon)'
    },
    development: {
      phase: 'Week 1 of 10',
      status: 'Foundation setup complete',
      next: 'User research and AI model integration',
      features: {
        completed: [
          'Project structure setup',
          'Basic API server',
          'Health monitoring',
          'Rate limiting',
          'Security middleware'
        ],
        upcoming: [
          'Database connection',
          'User authentication',
          'AI model integration',
          'Scenario management',
          'Progress tracking'
        ]
      }
    },
    documentation: {
      api: '/docs/api (coming soon)',
      technical: '/docs/technical (coming soon)',
      userGuide: '/docs/user-guide (coming soon)'
    }
  });
});
