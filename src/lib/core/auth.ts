import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/core/db";

/**
 * Resolves the signed-in Clerk user to an Ilder OS `User` + active
 * `Workspace`, provisioning both on first sign-in. Every server action,
 * route handler, and server component that needs workspace-scoped data
 * should call this rather than touching Clerk or Prisma directly — it is
 * the single seam where "who is asking, and on behalf of which workspace"
 * is resolved.
 */
export async function requireWorkspaceContext() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let user = await db.user.findUnique({
    where: { clerkId: userId },
    include: { memberships: { include: { workspace: true } } },
  });

  if (!user) {
    const clerkUser = await currentUser();
    const email = clerkUser?.primaryEmailAddress?.emailAddress ?? `${userId}@placeholder.ilder.os`;
    const name = clerkUser?.fullName ?? clerkUser?.username ?? "New Creator";

    user = await db.user.create({
      data: {
        clerkId: userId,
        email,
        name,
        imageUrl: clerkUser?.imageUrl,
        memberships: {
          create: {
            role: "OWNER",
            workspace: {
              create: {
                name: `${name}'s Workspace`,
                slug: `${userId.slice(-8)}-workspace`.toLowerCase(),
              },
            },
          },
        },
      },
      include: { memberships: { include: { workspace: true } } },
    });
  }

  const workspace = user.memberships[0]?.workspace;
  if (!workspace) redirect("/onboarding");

  return { user, workspace };
}
