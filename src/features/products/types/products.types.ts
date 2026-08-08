import type { ProductStatus } from "@/types";

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  priceLabel: string | null;
  mrr: number | null;
}
