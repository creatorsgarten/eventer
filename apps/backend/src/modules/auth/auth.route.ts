import { db } from "#backend/infrastructure/db";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { supabase } from "#backend/infrastructure/db/supabase";
import { UserRepository } from "#backend/modules/user/user.repository";

const userRepository = new UserRepository(db);

const app = new Hono()
  .get("/google", async (c) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:4000/api/auth/callback",
        scopes: "email profile",
      },
    });

    if (error) {
      return c.json({ error: "Failed to sign in with Google" }, 500);
    }

    return c.redirect(data.url);
  })
  .get("/callback", async (c) => {
    const code = c.req.query("code");
    if (!code) {
      return c.json({ error: "No code provided" }, 400);
    }

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return c.json({ error: "Failed to exchange code for session" }, 500);
    }

    if (!data.session) {
      return c.json({ error: "No session returned from Supabase" }, 500);
    }

    const { session, user } = data;

    if (!user.email) {
      return c.json({ error: "No email provided" }, 400);
    }

    const appUser = await userRepository.findByEmail(user.email);

    if (!appUser) {
      await userRepository.create({
        id: user.id,
        email: user.email,
        username: user.user_metadata.full_name || user.email,
      });
    }

    setCookie(c, "session", session.access_token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return c.redirect("http://localhost:3000/test");
  });

export { app as authRouter };
