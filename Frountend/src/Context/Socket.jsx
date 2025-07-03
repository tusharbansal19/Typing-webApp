import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

// Create the context
const SocketContext = createContext();

// Socket provider component
export const SocketProvider = ({ children }) => {
  const [roomName, setRoomName] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000", {
        transports: ['websocket'],
        reconnection: true,
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, roomName, setRoomName }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the SocketContext
export const useSocket = () => useContext(SocketContext);
