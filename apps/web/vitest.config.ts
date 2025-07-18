import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "jsdom", // Changed to jsdom for React component testing
		include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
		alias: {
			"@/": new URL("./src/", import.meta.url).pathname,
		},
		setupFiles: ["./tests/setup.ts"], // Add setup file for RTL
	},
});
