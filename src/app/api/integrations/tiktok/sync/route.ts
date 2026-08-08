import { NextResponse } from "next/server";
import { TIKTOK_VIDEO_LIST_URL } from "@/features/integrations/api/tiktok.constants";
import { integrationsService } from "@/features/integrations/api/integrations.service";
import { contentService } from "@/features/content/api/content.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

interface TikTokVideo {
  id: string;
  title?: string;
  video_description?: string;
  duration?: number;
  cover_image_url?: string;
  create_time: number; // unix seconds
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  view_count?: number;
}

interface TikTokVideoListResponse {
  data?: { videos: TikTokVideo[]; cursor?: number; has_more?: boolean };
  error?: { code: string; message: string };
}

const FIELDS =
  "id,title,video_description,duration,cover_image_url,create_time,like_count,comment_count,share_count,view_count";
const MAX_PAGES = 5; // 5 * 20 = up to 100 most recent videos per sync

/** POST /api/integrations/tiktok/sync — pulls the connected account's
 *  videos from TikTok's Display API and upserts them as ContentItems, each
 *  with a fresh ContentMetricSnapshot (see ContentRepository.upsertFromSync).
 *  This is the only place real engagement numbers for TikTok content come
 *  from — nothing is invented locally. */
export async function POST() {
  const workspaceId = await getDemoWorkspaceId();
  const secrets = await integrationsService.getSecrets(workspaceId, "TIKTOK");
  if (!secrets) {
    return NextResponse.json({ error: "TikTok isn't connected for this workspace yet." }, { status: 400 });
  }

  let cursor: number | undefined;
  let hasMore = true;
  let page = 0;
  let created = 0;
  let updated = 0;

  while (hasMore && page < MAX_PAGES) {
    page += 1;
    const res = await fetch(`${TIKTOK_VIDEO_LIST_URL}?fields=${FIELDS}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secrets.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ max_count: 20, ...(cursor ? { cursor } : {}) }),
    });

    const body = (await res.json()) as TikTokVideoListResponse;
    if (!res.ok || body.error?.code !== "ok" || !body.data) {
      return NextResponse.json(
        { error: body.error?.message ?? "TikTok video list request failed.", synced: created + updated },
        { status: 502 }
      );
    }

    for (const video of body.data.videos) {
      const { created: wasCreated } = await contentService.upsertFromSync(workspaceId, "TIKTOK", video.id, {
        title: video.title || video.video_description || "Untitled TikTok video",
        publishedAt: new Date(video.create_time * 1000),
        durationSecs: video.duration ?? null,
        thumbnailUrl: video.cover_image_url ?? null,
        metrics: {
          views: video.view_count ?? 0,
          likes: video.like_count ?? 0,
          comments: video.comment_count ?? 0,
          shares: video.share_count ?? 0,
        },
      });
      if (wasCreated) created += 1;
      else updated += 1;
    }

    hasMore = Boolean(body.data.has_more);
    cursor = body.data.cursor;
  }

  await integrationsService.markSynced(workspaceId, "TIKTOK");
  return NextResponse.json({ data: { created, updated, synced: created + updated } });
}
