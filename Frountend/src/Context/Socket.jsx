import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create the context
const SocketContext = createContext();

// Socket provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    // Connect to the server
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    // Listen for other users typing
    newSocket.on("userTyping", (data) => {
      setTypingUsers((prevUsers) => [...prevUsers, data.username]);
    });

    // Listen for other users stopping typing
    newSocket.on("userStoppedTyping", (username) => {
      setTypingUsers((prevUsers) => prevUsers.filter((user) => user !== username));
    });

    return () => newSocket.close(); // Clean up on unmount
  }, []);

  return (
    <SocketContext.Provider value={{ socket, typingUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the SocketContext
export const useSocket = () => useContext(SocketContext);
