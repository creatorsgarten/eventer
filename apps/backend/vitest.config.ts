import { config } from "dotenv";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "bun",
		include: ["src/**/*.test.ts"],
		pool: "forks",
		poolOptions: {
			forks: {
				singleFork: true,
			},
		},
		env: {
			...config({ path: ".env.test" }).parsed,
		},
	},
});
