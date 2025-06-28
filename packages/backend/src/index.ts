import { Hono } from "hono";
import { eventRouter } from "./modules/event";
import { userRouter } from "./modules/user";

const app = new Hono()
  .basePath("/api")
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/event", eventRouter)
  .route("/user", userRouter);

export { app };
