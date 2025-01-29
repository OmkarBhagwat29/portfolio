// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export", // Static export
  trailingSlash: true, // Required for GitHub Pages routing
  basePath: isProd ? "/portfolio" : "", // Your repository name
  assetPrefix: isProd ? "/portfolio/" : "", // Match basePath with trailing slash

  // Redirect configuration (if you still need this)
  async redirects() {
    return [
      {
        source: "/",
        destination: "/portfolio/kia",
        permanent: false,
      },
    ];
  }
};

export default nextConfig;