-- CreateEnum
CREATE TYPE "ConnectionPlatform" AS ENUM ('TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'X', 'LINKEDIN');

-- Remove fake seeded historical growth data (always platform = 'YOUTUBE',
-- never a real connection) so it can't blend with real synced snapshots
-- once AnalyticsSnapshot starts being written by actual platform syncs.
DELETE FROM "analytics_snapshots" WHERE "platform" = 'YOUTUBE';

-- AlterTable: cast in place (USING) instead of drop+recreate, so existing
-- PlatformConnection rows (live encrypted OAuth tokens) survive the enum
-- swap unchanged. Every value on both tables is a member of both enums
-- (TIKTOK), so the cast is lossless.
ALTER TABLE "platform_connections"
  ALTER COLUMN "platform" TYPE "ConnectionPlatform" USING ("platform"::text::"ConnectionPlatform");

ALTER TABLE "analytics_snapshots"
  ALTER COLUMN "platform" TYPE "ConnectionPlatform" USING ("platform"::text::"ConnectionPlatform");

-- DropIndex
DROP INDEX "analytics_snapshots_workspaceId_platform_capturedAt_idx";

-- CreateIndex: unique, not just indexed — lets a sync job upsert one row
-- per (workspace, platform, day) instead of piling up duplicates if it
-- runs more than once a day.
CREATE UNIQUE INDEX "analytics_snapshots_workspaceId_platform_capturedAt_key" ON "analytics_snapshots"("workspaceId", "platform", "capturedAt");
