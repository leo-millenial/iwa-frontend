import { createBarrier } from "@farfetched/core";

import { refreshTokenMutation } from "@/shared/api/auth/refresh-token.ts";
import { $isAuthenticated } from "@/shared/viewer";

export const authBarrier = createBarrier({
  active: $isAuthenticated,
  perform: [refreshTokenMutation],
});
