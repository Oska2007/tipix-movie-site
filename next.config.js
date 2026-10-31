/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['webtorrent'],
  },
};

module.exports = nextConfig;