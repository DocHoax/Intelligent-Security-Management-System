import type { Server } from "socket.io";

let socketServer: Server | null = null;

export function configureSocketServer(server: Server) {
  socketServer = server;
}

export function emitSecurityEvent(eventName: string, payload: unknown) {
  socketServer?.emit(eventName, payload);
}