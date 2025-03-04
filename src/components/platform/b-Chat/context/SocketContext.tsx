import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getToken } from "@/Utils/userToken/LocalToken";

const SOCKET_URL = "64.226.73.140:9000/api/v1/chat";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = getToken();
    console.log("token", token);
    
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token }, // Send token during connection
      transports: ["websocket"], // Ensure WebSocket connection
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
