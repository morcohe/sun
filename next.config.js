/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  reactStrictMode: false,
}

module.exports = nextConfig
