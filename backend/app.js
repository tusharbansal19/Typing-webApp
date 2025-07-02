const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connect } = require('./connect');
const userRoutes = require('./routes/user');
// Add other route imports as needed

const app = express();

// Connect to MongoDB
connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ukurl');

// CORS setup for credentials
app.use(cors({
  origin: 'http://localhost:5173', // Change to your frontend URL
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', userRoutes);
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