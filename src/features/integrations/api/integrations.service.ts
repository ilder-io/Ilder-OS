import { integrationsRepository, type UpsertConnectionInput } from "@/features/integrations/api/integrations.repository";
import type { ConnectionPlatform } from "@/types";
import type { PlatformConnectionStatusDTO, PlatformConnectionSecrets } from "@/features/integrations/types/integrations.types";

export const integrationsService = {
  async getStatus(workspaceId: string, platform: ConnectionPlatform): Promise<PlatformConnectionStatusDTO> {
    return integrationsRepository.getStatus(workspaceId, platform);
  },

  async getSecrets(workspaceId: string, platform: ConnectionPlatform): Promise<PlatformConnectionSecrets | null> {
    return integrationsRepository.getSecrets(workspaceId, platform);
  },

  async saveConnection(workspaceId: string, platform: ConnectionPlatform, data: UpsertConnectionInput): Promise<void> {
    return integrationsRepository.upsert(workspaceId, platform, data);
  },

  async markSynced(workspaceId: string, platform: ConnectionPlatform): Promise<void> {
    return integrationsRepository.markSynced(workspaceId, platform);
  },
};
