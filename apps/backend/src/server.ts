import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth.js";
import conversationRoutes from "./routes/conversations.routes.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import { initialiseSocket } from "./lib/socket-server.js";
import userRoutes from "./routes/user.routes.js";

console.log("Booting server...");
console.log("PORT:", process.env.PORT);
console.log("FRONTEND_URL exists:", !!process.env.FRONTEND_URL);
console.log("FRONTEND_URL: ", process.env.FRONTEND_URL); //TODO: delete after
console.log("BETTER_AUTH_URL: ", process.env.BETTER_AUTH_URL);

const app = express();
const httpServer = createServer(app);
const io = initialiseSocket(httpServer);

const PORT = process.env.PORT || 3001;

//app.use(cors());
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.all("/api/auth/*splat", (req, res, next) => {
  console.log("Auth request origin:", req.headers.origin);
  console.log("Auth request host:", req.headers.host);
  return toNodeHandler(auth)(req, res);
});

app.use(express.json());

app.use("/api/conversations", conversationRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Backend is healthy!");
});

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
      socket.join(`user_${userId}`);
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
      username: activeUsers.get(socket.id)?.username,
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

