/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3005/api/:path*', // Proxy to Backend on port 3005
      },
    ]
  },
}

export default nextConfig;