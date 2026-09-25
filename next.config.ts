import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product and banner images come straight from S3 / Unsplash (as before).
  images: { unoptimized: true },
  // Links stored by the staff portal that point at old routes.
  async redirects() {
    return [{ source: "/products", destination: "/shop", permanent: false }];
  },
};

export default nextConfig;
