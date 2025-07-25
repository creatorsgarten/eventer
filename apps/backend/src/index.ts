import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { env } from "./env";
import { agendaRouter } from "./modules/agenda";
import { authRouter } from "./modules/auth";
import { eventRouter } from "./modules/event";
import { homeRouter } from "./modules/home";
import { userRouter } from "./modules/user";

const port = env.PORT ?? Number(process.env.PORT) ?? 3000;

const app = new Elysia()
	.onError(({ code, error, set }) => {
		console.error(`Error [${code}]:`, error);

		if (code === "VALIDATION") {
			set.status = 400;
			return { error: "Validation Error", message: error.toString() };
		}

		set.status = 500;
		return { error: "Internal Server Error", message: error.toString() };
	})
	.use(
		cors({
			origin: [
				"https://eventer-web-git-feat-implement-ge-0f5106-methasit-puns-projects.vercel.app",
				"https://eventer-web-red.vercel.app", // optionally add production URL
				"http://localhost:3000", // for local development
				/.*\.vercel\.app$/, // Allow all Vercel preview deployments
			],
			credentials: true,
		})
	)
	.use(swagger())
	.group("/api", (app) =>
		app.use(homeRouter).use(eventRouter).use(userRouter).use(agendaRouter).use(authRouter)
	);

// Only listen if not in serverless environment (for local development)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}/api`);
	});
}

export { app };
export type AppType = typeof app;
