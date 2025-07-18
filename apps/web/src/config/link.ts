import { env } from "@/env";

const REDIRDCT_URI = encodeURIComponent(`${env.NEXT_PUBLIC_APP_URL}/auth/callback`);

export const SIGN_IN_LINK = `https://qtrkroiyvtnwdpjscyvp.supabase.co/auth/v1/authorize?provider=google&redirect_to=${REDIRDCT_URI}&scopes=email%20profile`;
