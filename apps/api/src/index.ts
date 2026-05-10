import { createServer } from "node:http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { env } from "./lib/env.js";
import { configureSocketServer } from "./lib/socket.js";

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.APP_ORIGIN,
    credentials: true
  }
});

configureSocketServer(io);

io.on("connection", (socket) => {
  socket.emit("notification", {
    type: "connected",
    message: "Realtime security feed connected"
  });

  socket.on("ping:system", () => {
    socket.emit("pong:system", {
      timestamp: new Date().toISOString()
    });
  });
});

server.listen(env.API_PORT, () => {
  console.log(`API listening on ${env.API_BASE_URL}`);
});