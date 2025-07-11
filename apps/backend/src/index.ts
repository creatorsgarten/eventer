import { Scalar } from "@scalar/hono-api-reference";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { openAPISpecs } from "hono-openapi";

import { agendaRouter } from "./modules/agenda";
import { eventRouter } from "./modules/event";
import { userRouter } from "./modules/user";
import { authRouter } from "./modules/auth";

const app = new Hono()
  .use(
    "*",
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  )
  .basePath("/api")
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/event", eventRouter)
  .route("/user", userRouter)
  .route("/agenda", agendaRouter)
  .route("/auth", authRouter);

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Eventer API",
        version: "1.0.0",
        description: "Hey!",
      },
      servers: [{ url: "http://localhost:4000", description: "Local Server" }],
    },
  })
);

app.get("/scalar", Scalar({ url: "/api/openapi" }));

serve(
  {
    port: 4000,
    fetch: app.fetch,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

type AppType = typeof app;
export { app, type AppType };
