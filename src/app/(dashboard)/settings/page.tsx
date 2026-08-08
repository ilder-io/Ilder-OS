import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { TikTokIntegrationRow } from "@/features/integrations/components/tiktok-integration-row";
import { integrationsService } from "@/features/integrations/api/integrations.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tiktok_connected?: string; tiktok_error?: string }>;
}) {
  const t = await getTranslations("settings");
  const { tiktok_connected, tiktok_error } = await searchParams;
  const workspaceId = await getDemoWorkspaceId();
  const tiktokStatus = await integrationsService.getStatus(workspaceId, "TIKTOK");

  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 max-w-3xl">
        <PageHeader title={t("pageTitle")} description={t("pageDescription")} />

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">{t("tabs.general")}</TabsTrigger>
            <TabsTrigger value="members">{t("tabs.members")}</TabsTrigger>
            <TabsTrigger value="integrations">{t("tabs.integrations")}</TabsTrigger>
            <TabsTrigger value="billing">{t("tabs.billing")}</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>{t("general.workspaceTitle")}</CardTitle>
                <CardDescription>{t("general.workspaceDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <Label htmlFor="ws-name">{t("general.workspaceNameLabel")}</Label>
                  <Input id="ws-name" defaultValue="Ilder's Workspace" />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("general.timezoneLabel")}</Label>
                  <Select defaultValue="America/New_York">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">{t("general.timezoneEastern")}</SelectItem>
                      <SelectItem value="America/Los_Angeles">{t("general.timezonePacific")}</SelectItem>
                      <SelectItem value="Europe/London">{t("general.timezoneLondon")}</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label>{t("general.languageLabel")}</Label>
                  <LanguageSwitcher />
                </div>
                <Separator />
                <Button size="sm">{t("general.saveChanges")}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>{t("members.title")}</CardTitle>
                <CardDescription>{t("members.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm text-foreground">{t("members.you")}</p>
                    <p className="text-2xs text-muted-foreground">{t("members.ownerFullAccess")}</p>
                  </div>
                  <Badge variant="outline">{t("members.owner")}</Badge>
                </div>
                <Button variant="outline" size="sm">{t("members.invite")}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>{t("integrations.title")}</CardTitle>
                <CardDescription>{t("integrations.description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {tiktok_connected && (
                  <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-3 text-2xs text-success">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    {t("integrations.tiktok.connectSuccess")}
                  </div>
                )}
                {tiktok_error && (
                  <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-2xs text-destructive">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {t("integrations.tiktok.connectError", { error: tiktok_error })}
                  </div>
                )}
                <TikTokIntegrationRow status={tiktokStatus} />
                {["YouTube", "Instagram", "X", "LinkedIn"].map((p) => (
                  <div key={p} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-sm text-foreground">{p}</span>
                    <Button variant="outline" size="sm">{t("integrations.connect")}</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>{t("billing.title")}</CardTitle>
                <CardDescription>{t("billing.freePlanDescription")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm">{t("billing.upgrade")}</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
