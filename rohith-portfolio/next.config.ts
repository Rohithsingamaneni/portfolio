import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // This enables the static export
  images: {
    unoptimized: true, // Required for static exports
  },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Replace 'portfolio' with your actual repository name
  basePath: "/portfolio",
};

export default nextConfig;
