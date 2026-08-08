import { getTranslations } from "next-intl/server";
import { Topbar } from "@/components/layout/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ProductCard } from "@/features/products/components/product-card";
import { NewProductButton } from "@/features/products/components/new-product-button";
import { productsService } from "@/features/products/api/products.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";
import { DollarSign, Package, Rocket } from "lucide-react";

export default async function ProductsPage() {
  const workspaceId = await getDemoWorkspaceId();
  const products = await productsService.listProducts(workspaceId);
  const totalMRR = products.reduce((s, p) => s + (p.mrr ?? 0), 0);
  const live = products.filter((p) => p.status === "LIVE").length;
  const building = products.filter((p) => p.status === "BUILDING").length;
  const t = await getTranslations("products");

  return (
    <>
      <Topbar title={t("pageTitle")} />
      <main className="flex-1 px-6 py-6 pb-20 md:pb-6 space-y-6">
        <PageHeader
          title={t("pageTitle")}
          description={t("pageDescription")}
          actions={<NewProductButton />}
        />

        <div className="grid grid-cols-3 gap-4">
          <StatCard label={t("statMRR")} value={`$${totalMRR.toLocaleString()}`} icon={<DollarSign />} />
          <StatCard label={t("statLive")} value={String(live)} icon={<Package />} />
          <StatCard label={t("statBuilding")} value={String(building)} icon={<Rocket />} />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </>
  );
}
