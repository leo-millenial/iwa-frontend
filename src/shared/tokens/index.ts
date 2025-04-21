import { combine, createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/local";

import { appStarted } from "@/shared/init";

export const pickupTokens = createEvent();
export const setTokens = createEvent<{ access_token?: string; refresh_token?: string }>();
export const clearTokens = createEvent();

export const $accessToken = createStore("");
export const $refreshToken = createStore("");

$accessToken.on(setTokens, (_, { access_token }) => access_token);
$refreshToken.on(setTokens, (_, { refresh_token }) => refresh_token);

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
  key: "X-Auth-Access-Token",
});

persist({
  store: $refreshToken,
  pickup: pickupTokens,
  key: "X-Auth-Refresh-Token",
});

sample({
  clock: clearTokens,
  target: [$accessToken.reinit, $refreshToken.reinit],
});
