import { Hono } from "hono";
import { eventRouter } from "./modules/event";
import { userRouter } from "./modules/user";
import { agendaRouter } from "./modules/agenda";

const app = new Hono()
  .basePath("/api")
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/event", eventRouter)
  .route("/user", userRouter)
  .route("/agenda", agendaRouter);

export { app };
