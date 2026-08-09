import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createPkcePair } from "@/lib/core/pkce";
import { getAdapter } from "@/features/integrations/adapters/registry";

/** GET /api/integrations/[platform]/connect — kicks off the OAuth
 *  handshake for whichever adapter matches the URL segment. Platform-
 *  agnostic: it only knows the PlatformAdapter interface, never a
 *  specific provider's API shape. */
export async function GET(_req: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const adapter = getAdapter(platform);
  if (!adapter) return NextResponse.json({ error: "Unknown platform." }, { status: 404 });
  if (!adapter.isConfigured()) {
    return NextResponse.json({ error: `${adapter.platform} isn't configured yet.` }, { status: 500 });
  }

  const state = randomBytes(16).toString("hex");
  const { verifier, challenge } = createPkcePair();
  const url = adapter.buildAuthorizeUrl({ state, codeChallenge: challenge });

  const res = NextResponse.redirect(url);
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 600,
    path: "/",
  };
  res.cookies.set(`oauth_state_${platform}`, state, cookieOpts);
  res.cookies.set(`oauth_verifier_${platform}`, verifier, cookieOpts);
  return res;
}
