import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  // Windows + the Prisma 5 native query engine binary are flaky under
  // concurrent build workers (each jest-worker child process loads its own
  // copy of the engine DLL); several pages intermittently failed page-data
  // collection with misleading `PageNotFoundError`s until this was pinned
  // to a single worker. Revisit once Prisma is upgraded past v5.
  experimental: {
    cpus: 1,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
