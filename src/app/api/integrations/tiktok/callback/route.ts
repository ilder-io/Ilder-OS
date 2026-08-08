import { NextResponse, type NextRequest } from "next/server";
import {
  TIKTOK_TOKEN_URL,
  TIKTOK_OAUTH_STATE_COOKIE,
  TIKTOK_OAUTH_VERIFIER_COOKIE,
  tiktokEnv,
} from "@/features/integrations/api/tiktok.constants";
import { integrationsService } from "@/features/integrations/api/integrations.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

interface TikTokTokenResponse {
  access_token?: string;
  expires_in?: number;
  open_id?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
}

function clearOAuthCookies(res: NextResponse) {
  res.cookies.delete(TIKTOK_OAUTH_STATE_COOKIE);
  res.cookies.delete(TIKTOK_OAUTH_VERIFIER_COOKIE);
}

/** GET /api/integrations/tiktok/callback — TikTok redirects here with
 *  `code` after the user approves access on tiktok.com. Exchanges it for
 *  tokens (PKCE: sends back the `code_verifier` whose hash we sent as
 *  `code_challenge` in /connect) and stores them (encrypted) against the
 *  demo workspace. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const settingsUrl = new URL("/settings", req.url);

  const oauthError = searchParams.get("error");
  if (oauthError) {
    settingsUrl.searchParams.set("tiktok_error", oauthError);
    return NextResponse.redirect(settingsUrl);
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const savedState = req.cookies.get(TIKTOK_OAUTH_STATE_COOKIE)?.value;
  const verifier = req.cookies.get(TIKTOK_OAUTH_VERIFIER_COOKIE)?.value;

  if (!code || !state || !savedState || state !== savedState || !verifier) {
    settingsUrl.searchParams.set("tiktok_error", "invalid_state");
    const res = NextResponse.redirect(settingsUrl);
    clearOAuthCookies(res);
    return res;
  }

  const env = tiktokEnv();
  if (!env) {
    settingsUrl.searchParams.set("tiktok_error", "not_configured");
    const res = NextResponse.redirect(settingsUrl);
    clearOAuthCookies(res);
    return res;
  }

  const tokenRes = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
    body: new URLSearchParams({
      client_key: env.clientKey,
      client_secret: env.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: env.redirectUri,
      code_verifier: verifier,
    }),
  });

  const tokenData = (await tokenRes.json()) as TikTokTokenResponse;
  if (!tokenRes.ok || tokenData.error || !tokenData.access_token || !tokenData.open_id) {
    settingsUrl.searchParams.set("tiktok_error", tokenData.error_description ?? "token_exchange_failed");
    const res = NextResponse.redirect(settingsUrl);
    clearOAuthCookies(res);
    return res;
  }

  const workspaceId = await getDemoWorkspaceId();
  await integrationsService.saveConnection(workspaceId, "TIKTOK", {
    externalAccountId: tokenData.open_id,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token ?? null,
    tokenExpiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : null,
  });

  settingsUrl.searchParams.set("tiktok_connected", "1");
  const res = NextResponse.redirect(settingsUrl);
  clearOAuthCookies(res);
  return res;
}
