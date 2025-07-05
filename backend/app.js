const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connect } = require('./connect');
const userRoutes = require('./routes/user');
const matchRoutes = require('./routes/match');
// Add other route imports as needed

const app = express();

// Connect to MongoDB
// connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ukurl');

// CORS setup for credentials
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
   
      'https://typing-webapp-frountend.onrender.com',
      // 'https://typing-webapp-frontend.onrender.com'
      "https://typing-webapp-frountend.onrender.com"
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', userRoutes);
app.use('/api/match', matchRoutes);
// Add other routes here

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Hello from server' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});

module.exports = app; 