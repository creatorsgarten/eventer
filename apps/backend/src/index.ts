import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { env } from "./env";
import { agendaRouter } from "./modules/agenda";
import { authRouter } from "./modules/auth";
import { eventRouter } from "./modules/event";
import { homeRouter } from "./modules/home";
import { userRouter } from "./modules/user";

const app = new Elysia()
	.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
	.use(swagger())
	.group("/api", (app) =>
		app
			.use(homeRouter)
			.use(eventRouter)
			.use(userRouter)
			.use(agendaRouter)
			.use(authRouter),
	)
	.listen(env.PORT, () => {
		console.log(`Server is running on http://localhost:${env.PORT}/api`);
	});

export { app };
export type AppType = typeof app;
