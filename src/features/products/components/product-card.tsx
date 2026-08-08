import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { ProductStatusBadge } from "@/components/shared/status-badge";
import { ProductDeleteButton } from "@/features/products/components/product-delete-button";
import type { ProductDTO } from "@/features/products/types/products.types";

export async function ProductCard({ product }: { product: ProductDTO }) {
  const t = await getTranslations("products");
  return (
    <Card className="p-4 flex flex-col gap-3 h-full">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{product.name}</p>
        <div className="flex items-center gap-1 shrink-0">
          <ProductStatusBadge status={product.status} />
          <ProductDeleteButton productId={product.id} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground flex-1">{product.description}</p>
      <div className="flex items-center justify-between pt-2 border-t border-border text-2xs font-mono">
        <span className="text-muted-foreground">{product.priceLabel ?? "—"}</span>
        {product.mrr && <span className="text-success">{t("mrrValue", { value: product.mrr.toLocaleString() })}</span>}
      </div>
    </Card>
  );
}
