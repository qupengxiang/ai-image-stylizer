import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { styles } from '@/lib/styles';

const BASE_URL = 'https://imgart.shop';

interface Props {
  params: Promise<{ style: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { style: styleId } = await params;
  const style = styles.find(s => s.id === styleId);
  
  if (!style) {
    return {
      title: '风格未找到 | ImgArt',
    };
  }

  return {
    title: `${style.name}风格 - ${style.nameEn} | ImgArt`,
    description: `使用ImgArt的${style.name}风格转换你的照片。${style.prompt.slice(0, 100)}...`,
    keywords: [style.name, style.nameEn, ...style.keywords, 'ImgArt风格', 'AI图片转换'],
    alternates: {
      canonical: `${BASE_URL}/gallery/${style.id}`,
    },
    openGraph: {
      title: `${style.name}风格 - ImgArt`,
      description: `使用${style.name}风格生成独特的艺术图片`,
      url: `${BASE_URL}/gallery/${style.id}`,
      images: [style.example],
    },
  };
}

export async function generateStaticParams() {
  return styles.map((style) => ({
    style: style.id,
  }));
}

export default async function StyleDetailPage({ params }: Props) {
  const { style: styleId } = await params;
  const style = styles.find(s => s.id === styleId);
  
  if (!style) {
    notFound();
  }

  // 获取相关风格（同分类）
  const relatedStyles = styles
    .filter(s => s.category === style.category && s.id !== style.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回链接 */}
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-white hover:text-yellow-200 mb-6 transition-colors"
        >
          <span>←</span>
          <span>返回风格画廊</span>
        </Link>

        {/* 风格详情 */}
        <article className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* 主图 */}
          <div className="relative h-80 md:h-96">
            <img
              src={style.example}
              alt={`${style.name}风格示例`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{style.name}</h1>
              <p className="text-xl text-white/80">{style.nameEn}</p>
            </div>
          </div>

          {/* 风格信息 */}
          <div className="p-6">
            {/* AI提示词 */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🎯</span>
                <span>AI生成提示词</span>
              </h2>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-200">
                <p className="text-gray-700 leading-relaxed">{style.prompt}</p>
              </div>
            </section>

            {/* 风格标签 */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🏷️</span>
                <span>相关标签</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {style.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </section>

            {/* 尺寸建议 */}
            {style.aspectRatio && (
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>📐</span>
                  <span>推荐尺寸</span>
                </h2>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-gray-700">
                    推荐使用 <strong>{style.aspectRatio}</strong> 比例的图片以获得最佳效果
                  </p>
                </div>
              </section>
            )}

            {/* 使用此风格 */}
            <section className="text-center">
              <Link
                href={`/?style=${style.id}`}
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                🚀 使用此风格生成图片
              </Link>
            </section>
          </div>
        </article>

        {/* 相关风格 */}
        {relatedStyles.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">👇 你可能还喜欢</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedStyles.map((relatedStyle) => (
                <Link
                  key={relatedStyle.id}
                  href={`/gallery/${relatedStyle.id}`}
                  className="group"
                >
                  <article className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                    <div className="relative h-28 overflow-hidden">
                      <img
                        src={relatedStyle.example}
                        alt={relatedStyle.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-bold text-gray-800 group-hover:text-pink-500 transition-colors truncate text-sm">
                        {relatedStyle.name}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CreativeWork',
              name: `${style.name} - ${style.nameEn}`,
              description: style.prompt,
              keywords: style.keywords.join(', '),
              image: style.example,
              url: `${BASE_URL}/gallery/${style.id}`,
            }),
          }}
        />
      </div>
    </div>
  );
}
