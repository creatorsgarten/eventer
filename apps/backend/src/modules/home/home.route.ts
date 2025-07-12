import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const HomeResponseSchema = z.string().openapi({
  description: "Welcome message",
  example: "Hello Hono!",
});

const homeRoute = createRoute({
  method: "get",
  path: "/",
  responses: {
    200: {
      description: "Welcome to the Eventer API",
      content: {
        "text/plain": {
          schema: HomeResponseSchema,
        },
      },
    },
  },
});

const app = new OpenAPIHono();

app.openapi(homeRoute, (c) => {
  return c.text("Hello Hono!");
});

export { app as homeRouter };
