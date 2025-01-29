import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
