import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Unsplash assets used across the page
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
