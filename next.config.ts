import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization for better performance
  images: {
    unoptimized: true,
  },
  
  // Handle trailing slashes
  trailingSlash: true,
  
  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    resolveAlias: {
      '@vercel/turbopack-next/internal/font/google/font': 'next/font/google',
    },
  },
  
  // Error handling and performance optimization
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Headers for better caching and error handling
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
