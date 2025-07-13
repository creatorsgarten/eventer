import { edenFetch } from "@elysiajs/eden";
import type { AppType } from "@eventer/backend";
import { env } from "@/env";

export const client = edenFetch<AppType>(env.NEXT_PUBLIC_BACKEND_URL);
