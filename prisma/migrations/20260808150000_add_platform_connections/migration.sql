-- AlterTable
ALTER TABLE "content_items" ADD COLUMN     "externalId" TEXT;

-- CreateTable
CREATE TABLE "platform_connections" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "externalAccountId" TEXT NOT NULL,
    "accessTokenEnc" TEXT NOT NULL,
    "refreshTokenEnc" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_connections_workspaceId_platform_key" ON "platform_connections"("workspaceId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "content_items_workspaceId_platform_externalId_key" ON "content_items"("workspaceId", "platform", "externalId");

-- AddForeignKey
ALTER TABLE "platform_connections" ADD CONSTRAINT "platform_connections_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

