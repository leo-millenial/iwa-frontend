import { combine, createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/local";

import { appStarted } from "@/shared/init";
import { ACCESS_TOKEN_KEY } from "@/shared/tokens/consts.ts";

export const pickupTokens = createEvent();
export const setToken = createEvent<{ access_token?: string; refresh_token?: string }>();
export const clearToken = createEvent();

export const $accessToken = createStore("");

$accessToken.on(setToken, (_, { access_token }) => access_token);

export const $headers = combine($accessToken, (accessToken): Record<string, string> => {
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return headers;
});

sample({
  clock: appStarted,
  target: pickupTokens,
});

persist({
  store: $accessToken,
  pickup: pickupTokens,
  key: ACCESS_TOKEN_KEY,
});

sample({
  clock: clearToken,
  target: $accessToken.reinit,
});
