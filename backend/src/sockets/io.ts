import { Server as IOServer } from 'socket.io';
import http from 'http';
import { env } from '../config/env';

let io: IOServer | null = null;

export function initSocket(server: http.Server) {
  io = new IOServer(server, {
    cors: { origin: env.clientOrigin, credentials: true },
  });

  io.on('connection', (socket) => {
    socket.on('subscribe', (assessmentId: string) => {
      if (typeof assessmentId === 'string' && assessmentId) {
        socket.join(`assessment:${assessmentId}`);
      }
    });
  });

  return io;
}

export function emitProgress(
  assessmentId: string,
  payload: { status: string; progress: number; message?: string }
) {
  if (!io) return;
  io.to(`assessment:${assessmentId}`).emit('assessment:progress', {
    assessmentId,
    ...payload,
  });
}

export function emitReady(assessmentId: string) {
  if (!io) return;
  io.to(`assessment:${assessmentId}`).emit('assessment:ready', {
    assessmentId,
  });
}

export function emitFailed(assessmentId: string, message: string) {
  if (!io) return;
  io.to(`assessment:${assessmentId}`).emit('assessment:failed', {
    assessmentId,
    message,
  });
}
