import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5297',
                pathname: '/upload/product/**',
            },
        ],
    },
};

export default nextConfig;
