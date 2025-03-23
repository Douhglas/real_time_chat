import { Server as SocketIOServer, Socket } from "socket.io";

interface ChatMessage {
  user: string;
  message: string;
  timestamp: Date;
}

const messageHistory: ChatMessage[] = [];

export function setupSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("chat message", (msg: ChatMessage) => {
      msg.timestamp = new Date();
      messageHistory.push(msg);

      const enrichedMessage = {
        ...msg,
        formattedTime: msg.timestamp.toLocaleTimeString(),
      };

      const userMessages = messageHistory.filter((m) => m.user === msg.user);
      console.log(`Message history of ${msg.user}:`, userMessages);

      io.emit("chat message", enrichedMessage);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}


