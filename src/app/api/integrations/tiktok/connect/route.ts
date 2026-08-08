import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import {
  TIKTOK_AUTHORIZE_URL,
  TIKTOK_SCOPES,
  TIKTOK_OAUTH_STATE_COOKIE,
  TIKTOK_OAUTH_VERIFIER_COOKIE,
  createPkcePair,
  tiktokEnv,
} from "@/features/integrations/api/tiktok.constants";

/** GET /api/integrations/tiktok/connect — kicks off the OAuth handshake.
 *  The actual "log in with TikTok" step happens in the user's own browser
 *  on tiktok.com; this route only builds the authorize URL and redirects. */
export async function GET() {
  const env = tiktokEnv();
  if (!env) {
    return NextResponse.json(
      { error: "TikTok isn't configured yet — set TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REDIRECT_URI." },
      { status: 500 }
    );
  }

  const state = randomBytes(16).toString("hex");
  const { verifier, challenge } = createPkcePair();

  const url = new URL(TIKTOK_AUTHORIZE_URL);
  url.searchParams.set("client_key", env.clientKey);
  url.searchParams.set("scope", TIKTOK_SCOPES);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", env.redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  const res = NextResponse.redirect(url.toString());
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 600,
    path: "/",
  };
  res.cookies.set(TIKTOK_OAUTH_STATE_COOKIE, state, cookieOpts);
  res.cookies.set(TIKTOK_OAUTH_VERIFIER_COOKIE, verifier, cookieOpts);
  return res;
}
