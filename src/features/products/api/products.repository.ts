import { db } from "@/lib/core/db";
import type { Product } from "@prisma/client";
import type { ProductDTO } from "@/features/products/types/products.types";
import type { ProductFormValues } from "@/features/products/schemas/product.schema";

export interface ProductRepository {
  list(workspaceId: string): Promise<ProductDTO[]>;
  create(workspaceId: string, data: ProductFormValues): Promise<ProductDTO>;
  delete(workspaceId: string, id: string): Promise<void>;
}

function toProductDTO(row: Product): ProductDTO {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    status: row.status,
    priceLabel: row.priceCents != null ? `$${(row.priceCents / 100).toLocaleString()}` : null,
    mrr: row.mrr,
  };
}

export class PrismaProductRepository implements ProductRepository {
  async list(workspaceId: string): Promise<ProductDTO[]> {
    const rows = await db.product.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toProductDTO);
  }

  async create(workspaceId: string, data: ProductFormValues): Promise<ProductDTO> {
    const row = await db.product.create({
      data: {
        workspaceId,
        name: data.name,
        description: data.description,
        status: data.status,
        priceCents: data.priceDollars != null ? Math.round(data.priceDollars * 100) : undefined,
        mrr: data.mrr,
      },
    });
    return toProductDTO(row);
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    await db.product.deleteMany({ where: { id, workspaceId } });
  }
}

export const productRepository: ProductRepository = new PrismaProductRepository();
