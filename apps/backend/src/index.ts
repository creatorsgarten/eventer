// import { OpenAPIHono } from "@hono/zod-openapi";
import { serve } from "@hono/node-server";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { env } from "./env";
import { agendaRouter } from "./modules/agenda";
import { authRouter } from "./modules/auth";
import { eventRouter } from "./modules/event";
import { homeRouter } from "./modules/home";
import { userRouter } from "./modules/user";
import { openApiDocumentation } from "./shared/openapi";

const app = new Hono();

app
  .use(
    "*",
    cors({
      origin: [env.CORS_ORIGIN],
      credentials: true,
    })
  )
  .basePath("/api")
  .route("/", homeRouter)
  .route("/event", eventRouter)
  .route("/user", userRouter)
  .route("/agenda", agendaRouter)
  .route("/auth", authRouter);

// Add OpenAPI documentation endpoint
app.get("/openapi", (c) => {
  return c.json(openApiDocumentation);
});

// app.doc("/openapi", {
//   openapi: "3.0.0",
//   info: {
//     title: "Eventer API",
//     description: "API documentation for the Eventer application",
//     version: "1.0.0",
//   },
// });

// Scalar documentation endpoint
app.get("/scalar", Scalar({ url: "/openapi" }));

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
