import { Scalar } from "@scalar/hono-api-reference";

import { Hono } from "hono";
import { openAPISpecs } from "hono-openapi";

import { agendaRouter } from "./modules/agenda";
import { eventRouter } from "./modules/event";
import { userRouter } from "./modules/user";

const app = new Hono()
  .basePath("/api")
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/event", eventRouter)
  .route("/user", userRouter)
  .route("/agenda", agendaRouter);

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Eventer API",
        version: "1.0.0",
        description: "Hey!",
      },
      servers: [{ url: "http://localhost:3000", description: "Local Server" }],
    },
  })
);

app.get("/scalar", Scalar({ url: "/api/openapi" }));

type AppType = typeof app;
export { app, type AppType };
