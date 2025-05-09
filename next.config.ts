import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    dynamicIO: true,
    authInterrupts: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'linktr.ee',
        port: '',
        pathname: '/og/image/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
