import { attach, createEffect, createEvent, createStore, sample } from "effector";
import { interval } from "patronum";

import { fetchMessages } from "@/features/chat/messages/model";
import { setActiveChat } from "@/features/chat/select-active/model";

import { messageReceived, messagesFetched } from "@/entities/message/model";

import { appStarted } from "@/shared/init";
import { connectSocket, getSocket } from "@/shared/lib/socket";
import { routes } from "@/shared/routing";
import { $accessToken } from "@/shared/tokens";

// 📡 События сокета
export const socketConnected = createEvent();
export const socketDisconnected = createEvent();

// 🔄 Авто-reconnect
export const startReconnect = createEvent();
export const stopReconnect = createEvent();
export const reconnectFx = createEvent();

// 📶 Состояние подключения
export const $isConnected = createStore(false)
  .on(socketConnected, () => true)
  .on(socketDisconnected, () => false);

// 🧠 Нужно ли переподключаться?
export const $shouldReconnect = createStore(true)
  .on(socketDisconnected, () => true)
  .reset(socketConnected);

// 🔄 Добавляем автоматическую проверку состояния соединения
export const checkConnectionFx = createEffect(() => {
  const socket = getSocket();
  return Boolean(socket?.connected);
});

// 🔌 Эффект подключения к сокету
export const connectFx = attach({
  source: $accessToken,
  effect: async (token) => {
    if (!token) throw new Error("[SOCKET] JWT token not found");

    const socket = connectSocket(token);

    socket.on("connect", socketConnected);
    socket.on("disconnect", (reason) => {
      console.warn("[SOCKET] disconnected:", reason);
      socketDisconnected();
    });

    socket.on("newMessage", messageReceived);
    socket.on("chatMessages", messagesFetched);
  },
});

// ❌ Эффект ручного отключения
export const disconnectFx = createEffect(() => {
  const socket = getSocket();
  if (socket?.connected) {
    socket.disconnect();
    console.log("[SOCKET] manually disconnected");
  }
});

// ⏱ Автопереподключение по таймеру
const { tick } = interval({
  timeout: 5000,
  start: startReconnect,
  stop: stopReconnect,
});

// 🔁 Автоматический reconnect
sample({
  clock: tick,
  source: {
    token: $accessToken,
    isConnected: $isConnected,
    shouldReconnect: $shouldReconnect,
  },
  filter: ({ isConnected, shouldReconnect }) => !isConnected && shouldReconnect,
  fn: ({ token }) => token,
  target: connectFx,
});

// ⏱ Интервал проверки соединения
const { tick: connectionCheckTick } = interval({
  timeout: 10000, // Проверяем каждые 10 секунд
  start: appStarted,
  stop: disconnectFx.done,
});

// 🔍 Проверка состояния соединения по интервалу
sample({
  clock: connectionCheckTick,
  target: checkConnectionFx,
});

// 🔄 Обновление состояния подключения после проверки
sample({
  clock: checkConnectionFx.doneData,
  target: $isConnected,
});

// 🔁 Автоматический реконнект при обнаружении отсутствия соединения
sample({
  clock: checkConnectionFx.doneData,
  filter: (isConnected) => !isConnected,
  target: startReconnect,
});

// 🛑 Остановка попыток реконнекта при успешном подключении
sample({
  clock: socketConnected,
  target: stopReconnect,
});

// 🔁 Ручной reconnect
sample({
  clock: reconnectFx,
  source: $accessToken,
  filter: Boolean,
  target: connectFx,
});

// 🔄 Подключение при открытии маршрута company.chat | jobseeker.chat
sample({
  clock: [appStarted, $accessToken],
  filter: Boolean,
  target: connectFx,
});

// 🧭 Установка активного чата
sample({
  clock: [routes.company.chat.opened, routes.jobseeker.chat.opened],
  fn: ({ params }) => params.chatId,
  target: setActiveChat,
});

sample({
  clock: [
    appStarted,
    $accessToken,
    routes.company.chat.opened,
    routes.company.chats.opened,
    routes.jobseeker.chat.opened,
    routes.jobseeker.chats.opened,
  ],
  target: fetchMessages,
});
