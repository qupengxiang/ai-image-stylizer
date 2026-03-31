import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://imgart.shop';

export const metadata: Metadata = {
  title: '博客 - AI图片技巧与教程 | ImgArt',
  description: '探索ImgArt博客，学习AI图片制作技巧、卡通头像教程、各风格教程。无论你是新手还是高手，都能找到有用的指南！',
  keywords: ['AI图片教程', '卡通头像技巧', '图片风格化教程', 'ImgArt博客', 'AI工具使用指南'],
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
};

const blogPosts = [
  {
    slug: 'how-to-make-cartoon-avatar',
    title: '如何用AI制作卡通头像？完整教程（2024）',
    description: '手把手教你用ImgArt在线工具，将普通照片一键转换成可爱的卡通头像。无需设计基础，免费使用。',
    date: '2024-03-15',
    readTime: '5分钟',
    category: '教程',
    image: 'https://picsum.photos/seed/cartoon-avatar/800/400',
  },
  {
    slug: 'ai-image-stylizer-tools-comparison',
    title: '2024年最佳AI图片风格化工具对比评测',
    description: '对比评测ImgArt、Midjourney、DALL-E等主流AI图片风格化工具，从功能、价格、易用性等维度全面分析。',
    date: '2024-03-10',
    readTime: '8分钟',
    category: '评测',
    image: 'https://picsum.photos/seed/ai-tools/800/400',
  },
  {
    slug: 'disney-style-photo-tutorial',
    title: '如何制作迪士尼风格照片？AI一键生成教程',
    description: '迪士尼公主/王子梦不再遥远！使用ImgArt AI工具，将照片转换成梦幻的迪士尼动画风格。',
    date: '2024-03-08',
    readTime: '4分钟',
    category: '教程',
    image: 'https://picsum.photos/seed/disney-style/800/400',
  },
  {
    slug: 'anime-avatar-guide',
    title: '二次元动漫头像制作指南：如何用AI把照片变成动漫？',
    description: '详细讲解如何用AI工具将普通照片转换成精美的二次元动漫头像，包括风格选择、技巧分享。',
    date: '2024-03-05',
    readTime: '6分钟',
    category: '教程',
    image: 'https://picsum.photos/seed/anime-avatar/800/400',
  },
  {
    slug: 'pixel-art-photo-effect',
    title: '像素风格照片怎么制作？复古8-bit头像教程',
    description: '像素艺术（Pixel Art）近几年非常流行，教你如何用AI工具将照片一键转换成复古的8位/16位像素游戏风格。',
    date: '2024-03-01',
    readTime: '4分钟',
    category: '教程',
    image: 'https://picsum.photos/seed/pixel-art/800/400',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            📚 ImgArt 博客
          </h1>
          <p className="text-white text-xl max-w-2xl mx-auto drop-shadow-md">
            AI图片制作技巧、教程、评测... 探索无限创意可能！
          </p>
        </header>

        {/* 文章列表 */}
        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article
                className={`bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ${
                  index === 0 ? 'md:flex' : ''
                }`}
              >
                <div
                  className={`relative h-48 overflow-hidden ${
                    index === 0 ? 'md:w-1/2 md:h-auto' : ''
                  }`}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className={`p-6 ${index === 0 ? 'md:w-1/2 md:flex md:flex-col md:justify-center' : ''}`}>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <time dateTime={post.date}>{post.date}</time>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 group-hover:text-pink-500 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2">{post.description}</p>
                  <div className="mt-4 text-pink-500 font-bold group-hover:underline">
                    阅读更多 →
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* 底部CTA */}
        <div className="mt-12 bg-white/20 backdrop-blur rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">准备好开始创作了吗？</h3>
          <p className="text-white/90 mb-6">
            50+种风格、免费使用、即时生成
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
          >
            🚀 立即开始创作
          </Link>
        </div>

        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Blog',
              name: 'ImgArt 博客',
              description: 'AI图片制作技巧、教程、评测',
              url: `${BASE_URL}/blog`,
              blogPost: blogPosts.map((post) => ({
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.description,
                datePublished: post.date,
                url: `${BASE_URL}/blog/${post.slug}`,
                image: post.image,
              })),
            }),
          }}
        />
      </div>
    </div>
  );
}
