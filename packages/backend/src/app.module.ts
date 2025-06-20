import { Hono } from "hono";

const app = new Hono()
  .basePath("/api")
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .get("/books", (c) => {
    return c.json(
      [
        { id: 1, title: "1984", author: "George Orwell" },
        { id: 2, title: "Brave New World", author: "Aldous Huxley" },
        { id: 3, title: "Fahrenheit 451", author: "Ray Bradbury" },
      ],
      200
    );
  });

export { app };


