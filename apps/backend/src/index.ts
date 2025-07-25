import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { env } from "./env";
import { agendaRouter } from "./modules/agenda";
import { authRouter } from "./modules/auth";
import { eventRouter } from "./modules/event";
import { homeRouter } from "./modules/home";
import { userRouter } from "./modules/user";

const app = new Elysia({})
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
	.use(swagger())
	// .onRequest(({ set }) => {
	//   set.headers["access-control-allow-credentials"] = "true";
	//   set.headers["access-control-allow-origin"] = "https://eventer.betich.me";
	// })
	.group("/api", (app) =>
		app.use(homeRouter).use(eventRouter).use(userRouter).use(agendaRouter).use(authRouter)
	)
	.listen(env.PORT || 8080, () => {
		console.log(`Server is running on http://localhost:${env.PORT || 8080}/api`);
	});

export { app };
export type AppType = typeof app;
