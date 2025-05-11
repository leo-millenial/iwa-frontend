import { Socket, io } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  socket = io(socketUrl, { transports: ["websocket"], auth: { token } });

  return socket;
};

export const getSocket = (): Socket | null => socket;
