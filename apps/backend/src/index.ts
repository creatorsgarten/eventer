import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { env } from "./env";
import { agendaRouter } from "./modules/agenda";
import { authRouter } from "./modules/auth";
import { eventRouter } from "./modules/event";
import { homeRouter } from "./modules/home";
import { userRouter } from "./modules/user";

// Helper function to conditionally add swagger
const conditionalSwagger = () => {
	// Check if we're in Cloudflare Workers environment (caches is a global in Workers)
	const isCloudflareWorkers = typeof caches !== "undefined";

	if (isCloudflareWorkers) {
		// Return a no-op plugin for Cloudflare Workers
		return new Elysia({ name: "swagger-noop" });
	}

	// Use swagger in other environments
	return swagger();
};

const app = new Elysia({ aot: false })
	.use(
		cors({
			// origin: "https://eventer.betich.me",
			origin: /.*\.betich\.me$/,
			// [
			//   /.*\.betich\.me$/,
			//   process.env.NODE_ENV === "development" ? /localhost:\d+/ : "",
			//   env.CORS_ORIGIN || "",
			// ],
			credentials: true,
			preflight: true,
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		})
	)
	.use(conditionalSwagger())
	.use(homeRouter)
	.use(eventRouter)
	.use(userRouter)
	.use(agendaRouter)
	.use(authRouter)
	.onRequest(({ set }) => {
		set.headers["access-control-allow-credentials"] = "true";
		// set.headers["access-control-allow-origin"] = "https://eventer.betich.me";
	});
// .group("/api", (app) =>
//   app
//     .use(homeRouter)
//     .use(eventRouter)
//     .use(userRouter)
//     .use(agendaRouter)
//     .use(authRouter)
// );

// Only listen when not in Cloudflare Workers environment
const isCloudflareWorkers = typeof caches !== "undefined";
if (!isCloudflareWorkers) {
	app.listen(
		{
			// hostname: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
			port: env.PORT || 8080,
		},
		() => {
			console.log(
				`Server is running at http://${
					process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost"
				}:${env.PORT || 8080}/api`
			);
		}
	);
}

export { app };
export type AppType = typeof app;

export default {
	async fetch(request: Request) {
		return app.handle(request);
	},
};
