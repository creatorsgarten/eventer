import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { supabase } from "#backend/infrastructure/db/supabase";

export interface AuthContext {
  Variables: {
    user: {
      id: string;
      email: string;
      username?: string;
    };
  };
}

export const authMiddleware = createMiddleware<AuthContext>(async (c, next) => {
  const sessionToken = getCookie(c, "session");

  if (!sessionToken) {
    return c.json({ error: "Authentication required" }, 401);
  }

  try {
    // Verify the session token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(sessionToken);

    if (error || !user || !user.email) {
      return c.json({ error: "Invalid session" }, 401);
    }

    // Set user in context
    c.set("user", {
      id: user.id,
      email: user.email,
      username: user.user_metadata?.full_name || user.email,
    });

    await next();
  } catch (_error) {
    return c.json({ error: "Authentication failed" }, 401);
  }
});

// Optional auth middleware - doesn't fail if no token
export const optionalAuthMiddleware = createMiddleware<AuthContext>(
  async (c, next) => {
    const sessionToken = getCookie(c, "session");

    if (sessionToken) {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser(sessionToken);

        if (!error && user && user.email) {
          c.set("user", {
            id: user.id,
            email: user.email,
            username: user.user_metadata?.full_name || user.email,
          });
        }
      } catch (_error) {
        // Ignore auth errors for optional middleware
      }
    }

    await next();
  }
);
