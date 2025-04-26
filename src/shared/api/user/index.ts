import { concurrency, createJsonQuery, declareParams } from "@farfetched/core";

import { meResponseContract } from "@/shared/api/user/get-me.contracts.ts";
import { $headers } from "@/shared/tokens";

export const getMeQuery = createJsonQuery({
  params: declareParams(),
  request: {
    url: "/api/user/me",
    method: "GET",
    headers: $headers,
  },
  response: {
    contract: meResponseContract,
  },
});

concurrency(getMeQuery, { strategy: "TAKE_LATEST" });
