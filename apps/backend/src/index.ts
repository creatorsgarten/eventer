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
	// Skip swagger in production or serverless environments
	const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
	const isCloudflareWorkers = typeof caches !== "undefined";

	if (isProduction || isCloudflareWorkers) {
		return new Elysia({ name: "swagger-noop" });
	}

	return swagger();
};

const app = new Elysia({ aot: false })
	.use(
		cors({
			origin:
				process.env.NODE_ENV === "production"
					? (env.CORS_ORIGINS ?? "")
							.split(",")
							.map((o: string) => o.trim())
							.filter(Boolean)
					: [env.CORS_ORIGIN, /localhost:\d+/],
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
	.onRequest(({ request, set }) => {
		set.headers["access-control-allow-credentials"] = "true";

		// Force HTTPS in production
		if (process.env.NODE_ENV === "production") {
			const proto = request.headers.get("x-forwarded-proto");
			if (proto && proto !== "https") {
				const url = new URL(request.url);
				url.protocol = "https:";
				set.status = 301;
				set.headers.location = url.toString();
				return;
			}
		}
	});
// .group("/api", (app) =>
//   app
//     .use(homeRouter)
//     .use(eventRouter)
//     .use(userRouter)
//     .use(agendaRouter)
//     .use(authRouter)
// );

// Only listen in local development (not on Vercel or Cloudflare Workers)
const isServerless = typeof caches !== "undefined" || process.env.VERCEL === "1";
if (!isServerless) {
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
