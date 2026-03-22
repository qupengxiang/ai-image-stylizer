/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Cloudflare specific config
  experimental: {
    // Enable Cloudflare Workers support
  },
};

module.exports = nextConfig;
