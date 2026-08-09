"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { PlatformConnectionStatusDTO } from "@/features/integrations/types/integrations.types";

export function TikTokIntegrationRow({ status }: { status: PlatformConnectionStatusDTO }) {
  const t = useTranslations("settings.integrations.tiktok");
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  async function onSync() {
    setSyncing(true);
    const res = await fetch("/api/integrations/tiktok/sync", { method: "POST" });
    const body = await res.json();
    setSyncing(false);
    if (!res.ok) {
      toast.error(body.error ?? t("syncError"));
      return;
    }
    toast.success(t("syncSuccess", { count: body.data.synced }));
    if (body.data.statsError) {
      toast.warning(t("statsError", { error: body.data.statsError }));
    }
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">TikTok</span>
          {status.connected && <Badge variant="success">{t("connected")}</Badge>}
        </div>
        {status.connected && (
          <p className="text-2xs text-muted-foreground mt-0.5">
            {status.lastSyncedAt ? t("lastSynced", { date: formatDate(status.lastSyncedAt) }) : t("neverSynced")}
          </p>
        )}
      </div>
      {status.connected ? (
        <Button variant="outline" size="sm" disabled={syncing} onClick={onSync}>
          {syncing ? t("syncing") : t("syncNow")}
        </Button>
      ) : (
        <Button variant="outline" size="sm" asChild>
          <a href="/api/integrations/tiktok/connect">{t("connect")}</a>
        </Button>
      )}
    </div>
  );
}
