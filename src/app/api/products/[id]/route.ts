import { NextResponse } from "next/server";
import { productsService } from "@/features/products/api/products.service";
import { getDemoWorkspaceId } from "@/lib/core/workspace";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workspaceId = await getDemoWorkspaceId();
  await productsService.deleteProduct(workspaceId, id);
  return new NextResponse(null, { status: 204 });
}
