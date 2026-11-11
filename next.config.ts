import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/day-by-day-v2",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
