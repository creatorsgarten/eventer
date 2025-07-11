import { db } from "#backend/infrastructure/db";
import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { supabase } from "#backend/infrastructure/db/supabase";
import { UserRepository } from "#backend/modules/user/user.repository";
import { zValidator } from "@hono/zod-validator";
import { AuthCallbackSchema } from "#backend/shared/schemas";

const userRepository = new UserRepository(db);

const app = new Hono()
  .get("/google", async (c) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:3000/auth/callback",
          scopes: "email profile",
        },
      });

      if (error) {
        return c.json({ error: "Failed to sign in with Google" }, 500);
      }

      return c.redirect(data.url);
    } catch (_error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .post("/callback", zValidator("json", AuthCallbackSchema), async (c) => {
    try {
      let session = null;
      let user = null;

      // Get tokens from request body (sent from client-side)
      const { access_token: accessToken, refresh_token: refreshToken } =
        c.req.valid("json");

      if (accessToken && refreshToken) {
        // Handle tokens directly
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          return c.json({ error: "Failed to set session with tokens" }, 500);
        }

        if (!data.session) {
          return c.json({ error: "No session created from tokens" }, 500);
        }

        session = data.session;
        user = data.user;
      } else {
        return c.json({ error: "No tokens provided" }, 400);
      }

      if (!user || !user.email) {
        return c.json({ error: "No user or email provided" }, 400);
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

      return c.json({
        success: true,
        message: "Authentication successful",
        user: {
          id: user.id,
          email: user.email,
          username: user.user_metadata.full_name || user.email,
          avatar_url:
            user.user_metadata.avatar_url || user.user_metadata.picture,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 500);
      }
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .post("/logout", async (c) => {
    try {
      // Clear the session cookie
      setCookie(c, "session", "", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 0, // This immediately expires the cookie
      });

      return c.json({ success: true, message: "Logged out successfully" });
    } catch (_error) {
      return c.json({ error: "Failed to logout" }, 500);
    }
  });

export { app as authRouter };
