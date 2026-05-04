/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www-asia.nissan-cdn.net",
      },
    ],
  },
  async headers() {
    return [
      {
        // API routes should not be cached
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
      {
        // Static assets can be cached long-term (they have content hashes)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Dynamic pages: allow short caching with revalidation
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=60, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/offers",
        destination: "/cars",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
