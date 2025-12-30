import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth";
import conversationRoutes from "./routes/conversations.routes";
import { globalErrorHandler } from "./middleware/errorHandler";
import { initialiseSocket } from "./lib/socket-server";

const app = express();
const httpServer = createServer(app);
const io = initialiseSocket(httpServer);

const PORT = process.env.PORT || 3001;

//app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api/conversations", conversationRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const activeUsers = new Map<string, { userId: string; username: string }>();
const socketUserMap = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on(
    "user_join",
    ({ userId, username }: { userId: string; username: string }) => {
      activeUsers.set(socket.id, { userId, username });
      socketUserMap.set(socket.id, userId);
      console.log(`${username} joined (${userId})`);
    },
  );

  socket.on("join_conversation", (conversationId: string) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined ${conversationId}`);

    socket.to(conversationId).emit("user_joined_conversation", {
      userId: socketUserMap.get(socket.id),
      username: activeUsers.get(socket.id)?.username,
    });
  });

  socket.on("leave_conversation", (conversationId: string) => {
    socket.leave(conversationId);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);

    socket.to(conversationId).emit("user_left_conversation", {
      userId: socketUserMap.get(socket.id),
    });
  });

  socket.on(
    "send_message",
    ({
      conversationId,
      message,
    }: {
      conversationId: string;
      message: string;
    }) => {
      io.to(conversationId).emit("new_message", {
        conversationId,
        message,
        sender: {
          userId: socketUserMap.get(socket.id),
          username: activeUsers.get(socket.id)?.username,
        },
        timestamp: new Date().toISOString(),
      });
    },
  );

  socket.on("typing_start", (conversationId: string) => {
    socket.to(conversationId).emit("user_typing", {
      userId: socketUserMap.get(socket.id),
      username: activeUsers.get(socket.id)?.username,
    });
  });

  socket.on("typing_stop", (conversationId: string) => {
    socket.to(conversationId).emit("user_stopped_typing", {
      userId: socketUserMap.get(socket.id),
    });
  });

  socket.on("disconnect", () => {
    const user = activeUsers.get(socket.id);
    console.log("User disconnected:", socket.id, user?.username);
    activeUsers.delete(socket.id);
    socketUserMap.delete(socket.id);
  });

  socket.on("error", (error: Error) => {
    console.error("Socket error:", error);
  });
});

app.use(globalErrorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
