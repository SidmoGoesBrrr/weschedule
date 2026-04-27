import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.redirect('http://localhost:3000/availability');
});

io.on('connection', (socket) => {
  const roomValue = socket.handshake.query.roomId;
  const roomId = typeof roomValue === "string" && roomValue.trim() ? roomValue : "availability-default";
  socket.join(roomId);
  console.log(`a user connected to room: ${roomId}`);
  
  socket.on('chat message', (msg: string | { text?: string; senderName?: string }) => {
    const text = typeof msg === "string" ? msg.trim() : (msg.text ?? "").trim();
    const senderName =
      typeof msg === "string"
        ? "Unknown User"
        : typeof msg.senderName === "string" && msg.senderName.trim()
          ? msg.senderName.trim()
          : "Unknown User";

    if (!text) {
      return;
    }

    socket.to(roomId).emit('chat message', {
      id: crypto.randomUUID(),
      text,
      senderName,
    });
    console.log(`message in ${roomId} from ${senderName}: ${text}`);
  });

  socket.on('disconnect', () => {
    console.log(`a user disconnected from room: ${roomId}`);
  });
});

server.listen(4000, () => {
  console.log('server running at http://localhost:4000');
});