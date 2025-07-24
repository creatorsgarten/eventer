import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { env } from "../src/env";
import { agendaRouter } from "../src/modules/agenda";
import { authRouter } from "../src/modules/auth";
import { eventRouter } from "../src/modules/event";
import { homeRouter } from "../src/modules/home";
import { userRouter } from "../src/modules/user";

const app = new Elysia()
	.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
	.use(swagger())
	.group("/api", (app) =>
		app.use(homeRouter).use(eventRouter).use(userRouter).use(agendaRouter).use(authRouter)
	);

// Export for Vercel serverless functions
export default async function handler(req: Request) {
	return app.fetch(req);
}
