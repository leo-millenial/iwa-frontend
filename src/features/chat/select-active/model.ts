import { createEvent, createStore } from "effector";

export const setActiveChat = createEvent<string>();
export const resetActiveChat = createEvent();

export const $activeChatId = createStore<string | null>(null)
  .on(setActiveChat, (_, id) => id)
  .reset(resetActiveChat);
