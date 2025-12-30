import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: Server | null = null;

export function initialiseSocket(httpServer: HTTPServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.io not initialised");
  }
  return io;
}
