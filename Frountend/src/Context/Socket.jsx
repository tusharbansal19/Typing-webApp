import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create the context
const SocketContext = createContext();

// Socket provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    const newSocket = io("https://typing-webapp-backend.onrender.com/", {
      transports: ['websocket'],
      reconnection: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, roomName, setRoomName }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the SocketContext
export const useSocket = () => useContext(SocketContext);
