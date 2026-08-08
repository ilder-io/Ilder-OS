import { db } from "@/lib/core/db";
import { encrypt, decrypt } from "@/lib/core/crypto";
import type { Platform } from "@/types";
import type { PlatformConnectionStatusDTO, PlatformConnectionSecrets } from "@/features/integrations/types/integrations.types";

export interface UpsertConnectionInput {
  externalAccountId: string;
  accessToken: string;
  refreshToken?: string | null;
  tokenExpiresAt?: Date | null;
}

export interface IntegrationsRepository {
  getStatus(workspaceId: string, platform: Platform): Promise<PlatformConnectionStatusDTO>;
  getSecrets(workspaceId: string, platform: Platform): Promise<PlatformConnectionSecrets | null>;
  upsert(workspaceId: string, platform: Platform, data: UpsertConnectionInput): Promise<void>;
  markSynced(workspaceId: string, platform: Platform): Promise<void>;
}

export class PrismaIntegrationsRepository implements IntegrationsRepository {
  async getStatus(workspaceId: string, platform: Platform): Promise<PlatformConnectionStatusDTO> {
    const row = await db.platformConnection.findUnique({
      where: { workspaceId_platform: { workspaceId, platform } },
    });
    return {
      platform,
      connected: Boolean(row),
      externalAccountId: row?.externalAccountId ?? null,
      lastSyncedAt: row?.lastSyncedAt?.toISOString() ?? null,
    };
  }

  async getSecrets(workspaceId: string, platform: Platform): Promise<PlatformConnectionSecrets | null> {
    const row = await db.platformConnection.findUnique({
      where: { workspaceId_platform: { workspaceId, platform } },
    });
    if (!row) return null;
    return {
      accessToken: decrypt(row.accessTokenEnc),
      refreshToken: row.refreshTokenEnc ? decrypt(row.refreshTokenEnc) : null,
      tokenExpiresAt: row.tokenExpiresAt,
    };
  }

  async upsert(workspaceId: string, platform: Platform, data: UpsertConnectionInput): Promise<void> {
    const accessTokenEnc = encrypt(data.accessToken);
    const refreshTokenEnc = data.refreshToken ? encrypt(data.refreshToken) : null;

    await db.platformConnection.upsert({
      where: { workspaceId_platform: { workspaceId, platform } },
      create: {
        workspaceId,
        platform,
        externalAccountId: data.externalAccountId,
        accessTokenEnc,
        refreshTokenEnc,
        tokenExpiresAt: data.tokenExpiresAt,
      },
      update: {
        externalAccountId: data.externalAccountId,
        accessTokenEnc,
        refreshTokenEnc,
        tokenExpiresAt: data.tokenExpiresAt,
      },
    });
  }

  async markSynced(workspaceId: string, platform: Platform): Promise<void> {
    await db.platformConnection.updateMany({
      where: { workspaceId, platform },
      data: { lastSyncedAt: new Date() },
    });
  }
}

export const integrationsRepository: IntegrationsRepository = new PrismaIntegrationsRepository();
