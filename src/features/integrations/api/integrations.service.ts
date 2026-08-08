import { integrationsRepository, type UpsertConnectionInput } from "@/features/integrations/api/integrations.repository";
import type { Platform } from "@/types";
import type { PlatformConnectionStatusDTO, PlatformConnectionSecrets } from "@/features/integrations/types/integrations.types";

export const integrationsService = {
  async getStatus(workspaceId: string, platform: Platform): Promise<PlatformConnectionStatusDTO> {
    return integrationsRepository.getStatus(workspaceId, platform);
  },

  async getSecrets(workspaceId: string, platform: Platform): Promise<PlatformConnectionSecrets | null> {
    return integrationsRepository.getSecrets(workspaceId, platform);
  },

  async saveConnection(workspaceId: string, platform: Platform, data: UpsertConnectionInput): Promise<void> {
    return integrationsRepository.upsert(workspaceId, platform, data);
  },

  async markSynced(workspaceId: string, platform: Platform): Promise<void> {
    return integrationsRepository.markSynced(workspaceId, platform);
  },
};
