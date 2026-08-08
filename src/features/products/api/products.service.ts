import { productRepository } from "@/features/products/api/products.repository";
import type { ProductDTO } from "@/features/products/types/products.types";
import type { ProductFormValues } from "@/features/products/schemas/product.schema";

export const productsService = {
  async listProducts(workspaceId: string): Promise<ProductDTO[]> {
    return productRepository.list(workspaceId);
  },

  async createProduct(workspaceId: string, data: ProductFormValues): Promise<ProductDTO> {
    return productRepository.create(workspaceId, data);
  },

  async deleteProduct(workspaceId: string, id: string): Promise<void> {
    return productRepository.delete(workspaceId, id);
  },
};
