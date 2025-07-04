require("dotenv").config();
const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { connect } = require("./connect");
const router = require("./routes/user"); // Main router file
const matchRouter = require("./routes/match");
const app = require('./app');
const initSocket = require('./socket');

const PORT_NO = process.env.PORT || 3000; // Fallback to 3000 if PORT isn't set
const server = http.createServer(app); // HTTP server

// Connect to MongoDB
connect(process.env.URL);

// Middleware
app.use(cors(
  {
    origin: "http://localhost:5173" || "https://typing-webapp-frountend.onrender.com"||"*",
    credentials: true,
  }
)); 
app.use(express.json());
app.use(cookieparser());

// Routes

// POST /pt: Handle basic requests with a JSON response

// GET /: Home route to test server status
app.get("/", (req, res) => {
  res.json({ message: "Hello from server" });
});



// User routes
app.use("/user", router);
app.use("/match", matchRouter);


initSocket(server);

// Start the server
server.listen(PORT_NO, () => {
  console.log(`Server is running on port ${PORT_NO}`);
});
