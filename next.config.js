/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true
  },
  reactStrictMode: false,
}

module.exports = nextConfig
