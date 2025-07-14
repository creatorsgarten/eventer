import { treaty } from "@elysiajs/eden";
import type { AppType } from "@eventer/backend";
import { env } from "@/env";

export const client = treaty<AppType>(env.NEXT_PUBLIC_BACKEND_URL);
