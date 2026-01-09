/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Skip all static page generation - render everything dynamically at runtime
  // This is needed because pages make API calls that aren't available at build time
  // Force all routes to be dynamic
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'x-middleware-cache',
            value: 'no-cache',
          },
        ],
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_MCP_WS: process.env.NEXT_PUBLIC_MCP_WS || 'ws://localhost:8000/ws',
  },
}

module.exports = nextConfig
