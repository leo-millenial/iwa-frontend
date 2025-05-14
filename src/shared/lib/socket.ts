import { Socket, io } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string): Socket => {
  // Используем URL без указания порта 3003
  // Socket.IO автоматически будет использовать тот же порт, что и для HTTP/HTTPS
  const socketUrl = "https://iwa-dev-api.duckdns.org"; // Убираем порт 3003

  console.log("Connecting to socket at:", socketUrl);

  socket = io(socketUrl, {
    transports: ["websocket", "polling"],
    auth: { token },
    path: "/socket.io/",
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Добавляем обработчики событий для отладки
  socket.on("connect", () => {
    console.log("Socket connected successfully");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;
