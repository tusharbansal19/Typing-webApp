require("dotenv").config();
const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { connect } = require("./connect");
const router = require("./route"); // Main router file
const url = require("./url"); // URL schema/model
const route = require("./route/user"); // User-related routes
const { auth1 } = require("./MIddleware/auth1");
const app = require('./app');
const initSocket = require('./socket');

const PORT_NO = process.env.PORT || 3000; // Fallback to 3000 if PORT isn't set
const server = http.createServer(app); // HTTP server

// Connect to MongoDB
connect("mongodb://127.0.0.1:27017/ukurl");

// Middleware
app.use(cors(
  {
    origin: "http://localhost:5173" || "*",
    credentials: true,
  }
)); 
app.use(express.json());
app.use(cookieparser());

// Routes

// POST /pt: Handle basic requests with a JSON response
app.post("/pt", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(`Received ID: ${id}`);
    return res.json({ done: true, id });
  } catch (err) {
    console.error("Error in /pt route:", err);
    return res.status(500).json({ error: err.message });
  }
});6+3 

// GET /: Home route to test server status
app.get("/", (req, res) => {
  res.json({ message: "Hello from server" });
});

// Protected URL routes with auth middleware
app.use("/url", auth1, router);

// User routes
app.use("/user", route);

// GET /:id: Handle URL redirection
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Received parameter: ${id}`);
    if (!id) return res.status(400).json({ error: "ID not provided" });

    const resp = await url.findOneAndUpdate(
      { sorturl: id }, // Match the short URL
      { $push: { visits: { timestamp: Date.now() } } }, // Add visit timestamp
      { new: true }
    );

    if (!resp) return res.status(404).json({ error: "URL not found" });
    console.log("Found URL:", resp);

    return res.redirect(resp.urlid || "http://pokemoner.com");
  } catch (error) {
    console.error("Error in /:id route:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Socket.IO functionality
const rooms = {}; // Store room details and members

initSocket(server);

// Start the server
server.listen(PORT_NO, () => {
  console.log(`Server is running on port ${PORT_NO}`);
});
