import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/auth";
import conversationRoutes from "./routes/conversations.routes";
import { globalErrorHandler } from "./middleware/errorHandler";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

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

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(globalErrorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
