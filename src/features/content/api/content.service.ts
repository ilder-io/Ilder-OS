import { contentRepository } from "@/features/content/api/content.repository";
import type { ContentItemDTO, SyncedContentInput } from "@/features/content/types/content.types";
import type { ContentItemFormValues } from "@/features/content/schemas/content.schema";
import type { Platform } from "@/types";

/**
 * Business logic for the Content module. Pages/Server Components call
 * *this*, never the repository directly — keeps query composition
 * (aggregation, sorting) out of both the data-access layer and the UI
 * layer, per Clean Architecture (see ARCHITECTURE.md).
 */
export const contentService = {
  async listContent(workspaceId: string): Promise<ContentItemDTO[]> {
    return contentRepository.list(workspaceId);
  },

  async getContentById(workspaceId: string, id: string): Promise<ContentItemDTO | null> {
    return contentRepository.getById(workspaceId, id);
  },

  async getPillars(workspaceId: string): Promise<string[]> {
    const items = await contentRepository.list(workspaceId);
    return Array.from(new Set(items.map((i) => i.pillar))).sort();
  },

  async createContent(workspaceId: string, data: ContentItemFormValues): Promise<ContentItemDTO> {
    return contentRepository.create(workspaceId, data);
  },

  async updateContent(workspaceId: string, id: string, data: Partial<ContentItemFormValues>): Promise<ContentItemDTO | null> {
    return contentRepository.update(workspaceId, id, data);
  },

  async deleteContent(workspaceId: string, id: string): Promise<void> {
    return contentRepository.delete(workspaceId, id);
  },

  async upsertFromSync(
    workspaceId: string,
    platform: Platform,
    externalId: string,
    data: SyncedContentInput
  ): Promise<{ created: boolean }> {
    return contentRepository.upsertFromSync(workspaceId, platform, externalId, data);
  },
};
