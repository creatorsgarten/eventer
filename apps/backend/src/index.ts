import { Scalar } from "@scalar/hono-api-reference";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

import { agendaRouter } from "./modules/agenda";
import { eventRouter } from "./modules/event";
import { userRouter } from "./modules/user";
import { authRouter } from "./modules/auth";
import { openApiDocumentation } from "./shared/openapi";
import { env } from "./env";

const app = new Hono()
  .use(
    "*",
    cors({
      origin: [env.CORS_ORIGIN],
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

// Add OpenAPI documentation endpoint
app.get("/openapi", (c) => {
  return c.json(openApiDocumentation);
});

// Scalar documentation endpoint
app.get("/scalar", Scalar({ url: "/api/openapi" }));

serve(
  {
    port: 4000,
    fetch: app.fetch,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}/api`);
  }
);

type AppType = typeof app;
export { app, type AppType };
