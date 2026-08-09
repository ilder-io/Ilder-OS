import { randomBytes, createHash } from "crypto";

export interface PkcePair {
  verifier: string;
  challenge: string;
}

/** RFC 7636 PKCE pair — a random `code_verifier` kept server-side (an
 *  httpOnly cookie) and its SHA-256 hash (`code_challenge`) sent up front
 *  in the authorize request. The callback proves it was the same browser
 *  that started the flow by sending the raw verifier back when exchanging
 *  the code. Generic OAuth mechanics — any adapter whose provider requires
 *  PKCE (TikTok's v2 authorize endpoint does) uses this same pair. */
export function createPkcePair(): PkcePair {
  const verifier = randomBytes(48).toString("base64url"); // 64 chars, within RFC 7636's 43-128 range
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}
