import { sample } from "effector";

import { clearToken } from "@/shared/tokens";
import { viewerLoggedOut } from "@/shared/viewer";

import { disconnectFx, stopReconnect } from "../connect/model.ts";

sample({
  clock: viewerLoggedOut,
  target: [stopReconnect, disconnectFx],
});

sample({
  clock: clearToken,
  target: [stopReconnect, disconnectFx],
});
