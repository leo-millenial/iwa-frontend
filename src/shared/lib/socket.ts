import { Socket, io } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  const socketUrl = "https://iwa-dev-api.duckdns.org";

  socket = io(socketUrl, {
    transports: ["websocket", "polling"],
    auth: { token },
    path: "/socket.io/",
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;
