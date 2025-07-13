import { edenFetch } from "@elysiajs/eden";
import type { AppType } from "./index.js";

export function createClient(baseUrl: string) {
	return edenFetch<AppType>(baseUrl);
}

// Export the AppType for users who want to use it directly
export type { AppType };
