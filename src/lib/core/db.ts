import { PrismaClient } from "@prisma/client";

/**
 * Single Prisma client instance, cached on `globalThis` in dev to survive
 * Next.js hot-reload (which would otherwise exhaust Postgres connections).
 *
 * IMPORTANT (Clean Architecture boundary): only files under
 * `src/features/<feature>/api/*.repository.ts` should import this. Components,
 * hooks, and pages must go through a repository/service — never call
 * `db.*` directly from a page or component. See ARCHITECTURE.md.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
