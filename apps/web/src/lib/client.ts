import type { AppType } from "@eventer/backend";
import { hc } from "hono/client";
import { env } from "@/env";

export const client = hc<AppType>(env.NEXT_PUBLIC_BACKEND_URL);
