import { NextResponse, type NextRequest } from "next/server";
import { getAdapter } from "@/features/integrations/adapters/registry";
import { integrationsService } from "@/features/integrations/api/integrations.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

function clearOAuthCookies(res: NextResponse, platform: string) {
  res.cookies.delete(`oauth_state_${platform}`);
  res.cookies.delete(`oauth_verifier_${platform}`);
}

/** GET /api/integrations/[platform]/callback — the provider redirects here
 *  with `code` after the user approves access. Exchanges it for tokens
 *  (PKCE: sends back the `code_verifier` whose hash was sent as
 *  `code_challenge` in /connect) and stores them (encrypted) against the
 *  demo workspace. Same shape for every platform — only the adapter's
 *  `exchangeCodeForTokens` differs. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const { searchParams } = new URL(req.url);
  const settingsUrl = new URL("/settings", req.url);

  const adapter = getAdapter(platform);
  if (!adapter) {
    settingsUrl.searchParams.set(`${platform}_error`, "unknown_platform");
    return NextResponse.redirect(settingsUrl);
  }

  const oauthError = searchParams.get("error");
  if (oauthError) {
    settingsUrl.searchParams.set(`${platform}_error`, oauthError);
    return NextResponse.redirect(settingsUrl);
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const savedState = req.cookies.get(`oauth_state_${platform}`)?.value;
  const verifier = req.cookies.get(`oauth_verifier_${platform}`)?.value;

  if (!code || !state || !savedState || state !== savedState || !verifier) {
    settingsUrl.searchParams.set(`${platform}_error`, "invalid_state");
    const res = NextResponse.redirect(settingsUrl);
    clearOAuthCookies(res, platform);
    return res;
  }

  if (!adapter.isConfigured()) {
    settingsUrl.searchParams.set(`${platform}_error`, "not_configured");
    const res = NextResponse.redirect(settingsUrl);
    clearOAuthCookies(res, platform);
    return res;
  }

  try {
    const tokens = await adapter.exchangeCodeForTokens({ code, codeVerifier: verifier });
    const workspaceId = await getDemoWorkspaceId();
    await integrationsService.saveConnection(workspaceId, adapter.platform, tokens);

    settingsUrl.searchParams.set(`${platform}_connected`, "1");
    const res = NextResponse.redirect(settingsUrl);
    clearOAuthCookies(res, platform);
    return res;
  } catch (err) {
    settingsUrl.searchParams.set(`${platform}_error`, err instanceof Error ? err.message : "token_exchange_failed");
    const res = NextResponse.redirect(settingsUrl);
    clearOAuthCookies(res, platform);
    return res;
  }
}
