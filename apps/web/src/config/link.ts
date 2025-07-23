import { env } from "@/env";

const REDIRDCT_URI = encodeURIComponent(`${env.NEXT_PUBLIC_APP_URL}/auth/callback`);

// http://localhost:54321/auth/v1/authorize?provider=keycloak&redirect_to=http://localhost:3000/auth/callback
export const SIGN_IN_LINK = `http://localhost:54321/auth/v1/authorize?provider=keycloak&redirect_to=http://localhost:3000/auth/callback`; // `https://qtrkroiyvtnwdpjscyvp.supabase.co/auth/v1/authorize?provider=google&redirect_to=${REDIRDCT_URI}&scopes=email%20profile`;
