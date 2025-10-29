/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/hedg',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
