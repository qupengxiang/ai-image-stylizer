/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // SEO优化：更友好的重复检测处理
  reactStrictMode: true,
  // 生成sitemap
  trailingSlash: true,
};

module.exports = nextConfig;
