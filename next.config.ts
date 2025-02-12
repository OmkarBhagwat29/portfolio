// next.config.ts
import type { NextConfig } from "next";
import { webpack } from "next/dist/compiled/webpack/webpack";

const nextConfig: NextConfig = {
  images: { unoptimized: true },

  // Redirect configuration (if you still need this)
  async redirects() {
    return [
      {
        source: "/",
        destination: "/arcAI",
        permanent: false,
      },
    ];
  },
  reactStrictMode: false,
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({ CESIUM_BASE_URL: JSON.stringify("/cesium") })
    );
  },
};

export default nextConfig;
