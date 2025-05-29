import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import cors from "cors";
import {createServer} from "http";
import {Server} from "socket.io";
import userRoutes from "./routes/user.route";
import chatsRoutes from "./routes/chat.route";
import messagesRoutes from "./routes/message.route";
import {IUser} from "./models/user.model";
const {errorHandler, notFound} = require("./middlewares/errorMiddleware");

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.json({message: "Chat API is running"});
});

app.use("/api/users", userRoutes);
app.use("/api/chats", chatsRoutes);
app.use("/api/messages", messagesRoutes);

app.use(notFound);
app.use(errorHandler);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData?._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    console.log("User joined room:", room);
    socket.join(room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing", room);
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing", room);
  });

  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;
    if (!chat.users) {
      console.log("Chat.users is undefined");
      return;
    }
    chat.users.forEach((user: IUser) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message received", newMessage);
    });
  });

  socket.off("setup", (userData) => {
    console.log("User disconnected:", socket.id);
    socket.leave(userData._id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export {httpServer};
