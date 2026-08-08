import { randomBytes, createHash } from "crypto";

export const TIKTOK_AUTHORIZE_URL = "https://www.tiktok.com/v2/auth/authorize/";
export const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
export const TIKTOK_VIDEO_LIST_URL = "https://open.tiktokapis.com/v2/video/list/";
export const TIKTOK_SCOPES = "user.info.basic,video.list";
export const TIKTOK_OAUTH_STATE_COOKIE = "tiktok_oauth_state";
export const TIKTOK_OAUTH_VERIFIER_COOKIE = "tiktok_oauth_verifier";

export function tiktokEnv() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;
  if (!clientKey || !clientSecret || !redirectUri) return null;
  return { clientKey, clientSecret, redirectUri };
}

/** TikTok's v2 authorize endpoint requires PKCE (RFC 7636) — a random
 *  `code_verifier` kept only in an httpOnly cookie, and its SHA-256 hash
 *  (`code_challenge`) sent up front. The callback proves it was the same
 *  browser that started the flow by sending the raw verifier back when
 *  exchanging the code, without which TikTok rejects the request. */
export function createPkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(48).toString("base64url"); // 64 chars, within RFC 7636's 43-128 range
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}
