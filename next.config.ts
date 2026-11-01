import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Ignore TypeScript errors during production builds */
  typescript: {
    ignoreBuildErrors: true,
  },

  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,

  /* Allow images from Unsplash */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;