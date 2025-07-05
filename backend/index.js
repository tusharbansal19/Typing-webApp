require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const socketIo = require("socket.io");
const { connect } = require("./connect");
const userRoutes = require("./routes/user");
const matchRoutes = require("./routes/match");
const initSocket = require('./socket');

const app = express();
const PORT_NO = process.env.PORT || 3000;

// Connect to MongoDB
connect(process.env.URL);

// CORS setup for credentials
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://typing-webapp-frountend.onrender.com',
      'http://localhost:5173',
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
app.use('/match', matchRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Hello from server' });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ success: false, message: err.message });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start the server
server.listen(PORT_NO, () => {
  console.log(`Server is running on port ${PORT_NO}`);
});
