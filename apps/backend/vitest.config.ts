import { config } from "dotenv";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["src/**/*.test.ts"],
		env: {
			...config({ path: ".env.test" }).parsed,
		},
	},
});
