import { createEvent, sample } from "effector";

import { initiateChatMutation } from "@/shared/api/chat/initiate";
import { InitiateChatRequest } from "@/shared/types/chat.types.ts";

export const formSubmitted = createEvent<InitiateChatRequest>();

sample({
  clock: formSubmitted,
  target: initiateChatMutation.start,
});
