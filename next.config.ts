import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ytrxhrltkqztkcnqlcrz.supabase.co",
      },
    ],
  },
};

export default nextConfig;
