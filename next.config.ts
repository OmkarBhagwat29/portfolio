// next.config.ts
import type { NextConfig } from "next";


const nextConfig: NextConfig = {

  images: { unoptimized: true },

  // Redirect configuration (if you still need this)
  async redirects() {
    return [
      {
        source: "/",
        destination: "/portfolio/kia",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
