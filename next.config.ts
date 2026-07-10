import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/brand/**",
      },
      {
        pathname: "/therapists/**",
      },
    ],
  },
};

export default nextConfig;
