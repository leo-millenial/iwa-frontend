import { createEvent, createStore } from "effector";

import { IMessage } from "@/shared/types/chat.types.ts";

export const messageReceived = createEvent<IMessage>();
export const messagesFetched = createEvent<IMessage[]>();

export const $messages = createStore<IMessage[]>([])
  .on(messageReceived, (state, msg) => [...state, msg])
  .on(messagesFetched, (_, msgs) => msgs);
