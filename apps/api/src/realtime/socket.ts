import type { Server } from "socket.io";

let ioInstance: Server | null = null;

export function registerRealtimeServer(io: Server): void {
  ioInstance = io;
}

export function broadcast(event: string, payload: unknown): void {
  if (!ioInstance) return;
  ioInstance.emit(event, payload);
}
