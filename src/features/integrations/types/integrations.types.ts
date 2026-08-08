import type { Platform } from "@/types";

/** Non-secret view of a connection — safe to send to the client. Never
 *  includes the token itself; see PlatformConnectionSecrets for that. */
export interface PlatformConnectionStatusDTO {
  platform: Platform;
  connected: boolean;
  externalAccountId: string | null;
  lastSyncedAt: string | null;
}

/** Server-only: decrypted tokens for calling the platform's API. Never
 *  serialize this into an API route response. */
export interface PlatformConnectionSecrets {
  accessToken: string;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
}
