import { Elysia } from "elysia";

export const homeRouter = new Elysia().get("/", () => "Hello Elysia");
