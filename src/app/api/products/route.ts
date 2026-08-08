import { NextResponse } from "next/server";
import { productSchema } from "@/features/products/schemas/product.schema";
import { productsService } from "@/features/products/api/products.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function GET() {
  const workspaceId = await getDemoWorkspaceId();
  const products = await productsService.listProducts(workspaceId);
  return NextResponse.json({ data: products });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const workspaceId = await getDemoWorkspaceId();
  const product = await productsService.createProduct(workspaceId, parsed.data);
  return NextResponse.json({ data: product }, { status: 201 });
}
