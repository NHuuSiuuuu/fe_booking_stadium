import envConfig from "@/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image không cho load ảnh từ domain ngoài nên phải làm như này
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/:path*`,
      },
    ];
  },
};

export default nextConfig;
