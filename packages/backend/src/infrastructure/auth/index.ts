// decode JWT token

import { env } from "#backend/env";

export async function decodeSupabaseJWT(token: string) {
  const response = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to decode JWT token");
  }

  return response.json();
}
