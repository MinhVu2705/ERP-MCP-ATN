/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_MCP_WS: process.env.NEXT_PUBLIC_MCP_WS || 'ws://localhost:8000/ws',
  },
}

module.exports = nextConfig
