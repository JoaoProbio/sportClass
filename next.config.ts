/** @type {import('next').NextConfig} */
try {
  // Shim deprecated util._extend to Object.assign to suppress DEP0060 warnings.
  // Some dependencies still call util._extend which emits a DeprecationWarning in Node.
  // This lightweight shim replaces that function at runtime in a defensive way.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const _util = require("util");
  if (_util && typeof _util._extend === "function") {
    _util._extend = Object.assign;
  }
} catch (e) {
  // ignore any error — shim is best-effort and must not block startup
}
const nextConfig = {
  // Image optimization
  images: {
    unoptimized: true,
  },

  // Handle trailing slashes
  trailingSlash: true,

  // Exclude backend folder from build (moved from experimental)
  outputFileTracingExcludes: {
    "*": ["./backend/**/*"],
  },

  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    resolveAlias: {
      "@vercel/turbopack-next/internal/font/google/font": "next/font/google",
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
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Rewrites: proxy /api/* to production backend to avoid CORS in development.
  // Note: restart dev server after this change. If you prefer using an env var,
  // replace the destination with process.env.NEXT_PUBLIC_API_BASE or similar.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://mainone-ptsq.onrender.com/api/:path*",
      },
    ];
  },

  // Add webpack config for SVGs and exclude backend folder
  webpack(config: any) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(ts|tsx|js|jsx|md|mdx)$/] },
      use: ["@svgr/webpack"],
    });

    // Exclude backend folder from build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/backend/**", "**/node_modules/**"],
    };

    // Exclude backend folder from webpack processing
    config.externals = config.externals || [];
    config.externals.push({
      "./backend/**": "commonjs ./backend/**",
    });

    return config;
  },
};

module.exports = nextConfig;
