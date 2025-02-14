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
    // Enable WebAssembly support
    config.experiments = { asyncWebAssembly: true, syncWebAssembly: true };

    // Add rule for `.wasm` files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource", // Use asset/resource to serve WASM files
      generator: {
        filename: "static/wasm/[name].[hash][ext]", // Output WASM in static/wasm/
      },
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("/cesium"),
        OPENCASCADE_BASE_URL: JSON.stringify("/opencascade"),
      })
    );
  },
};

export default nextConfig;
