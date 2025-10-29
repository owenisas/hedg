/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Only use basePath in production builds
  basePath: process.env.NODE_ENV === 'production' ? '/hedg' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
