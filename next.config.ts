import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    // Tree-shake the radix-ui barrel export. Without this the whole umbrella
    // package is pulled in even though we only use Dialog / Slot / Tabs / etc.
    // (lucide-react is already optimized by Next.js by default.)
    optimizePackageImports: ["radix-ui"],
  },
};

export default nextConfig;
