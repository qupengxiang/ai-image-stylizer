import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

const BASE_URL = 'https://imgart.shop';

export const metadata: Metadata = {
  title: '风格展示 - 图片转卡通、动漫、像素艺术 | ImgArt',
  description: '浏览ImgArt支持的50+种图片风格：卡通、动漫、像素、迪士尼、吉卜力等。点击查看每种风格的示例效果，找到你喜欢的艺术风格！',
  keywords: ['图片风格展示', '卡通风格示例', '动漫风格画廊', '像素艺术效果', '各种图片风格'],
  alternates: {
    canonical: `${BASE_URL}/gallery`,
  },
  openGraph: {
    title: 'ImgArt风格展示 - 50+艺术风格画廊',
    description: '浏览所有支持的图片艺术风格，点击查看大图和详情，免费在线转换你的照片！',
    url: `${BASE_URL}/gallery`,
  },
};

const stylesConfig = [
  { id: 'cute-cartoon', name: '可爱卡通', example: 'https://picsum.photos/id/237/512/512' },
  { id: 'anime-manga', name: '动漫漫画', example: 'https://picsum.photos/id/24/512/512' },
  { id: 'pixel-art', name: '像素艺术', example: 'https://picsum.photos/id/20/512/512' },
  { id: 'chibi', name: 'Q版人物', example: 'https://picsum.photos/id/64/512/512' },
  { id: 'comic-book', name: '漫画书', example: 'https://picsum.photos/id/91/512/512' },
  { id: 'disney', name: '迪士尼', example: 'https://picsum.photos/id/102/512/512' },
  { id: 'studio-ghibli', name: '吉卜力', example: 'https://picsum.photos/id/106/512/512' },
  { id: 'pop-art', name: '波普艺术', example: 'https://picsum.photos/id/133/512/512' },
  { id: 'cartoon-network', name: '卡通网络', example: 'https://picsum.photos/id/169/512/512' },
  { id: 'stop-motion', name: '定格动画', example: 'https://picsum.photos/id/177/512/512' },
  { id: 'retro-cartoon', name: '复古卡通', example: 'https://picsum.photos/id/180/512/512' },
  { id: 'digital-painting', name: '数字绘画', example: 'https://picsum.photos/id/188/512/512' },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🎨 风格展示画廊
          </h1>
          <p className="text-white text-xl max-w-2xl mx-auto drop-shadow-md">
            探索50+种独特的图片艺术风格，点击你喜欢的内容开始创作！
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
            >
              🚀 立即开始创作
            </Link>
          </div>
        </header>

        {/* 风格网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stylesConfig.map((style) => (
            <Link
              key={style.id}
              href={`/gallery/${style.id}`}
              className="group"
            >
              <article className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={style.example}
                    alt={`${style.name}风格示例`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <span className="text-white p-4 font-bold">查看详情 →</span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h2 className="text-lg font-bold text-gray-800 group-hover:text-pink-500 transition-colors">
                    {style.name}
                  </h2>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* 提示信息 */}
        <div className="mt-12 bg-white/20 backdrop-blur rounded-2xl p-6 text-center text-white">
          <p className="font-bold mb-2">💡 小提示</p>
          <p className="text-white/90">
            每种风格都有独特的AI提示词，点击风格卡片可以查看详情和示例效果
          </p>
        </div>

        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ImageGallery',
              name: 'ImgArt 风格展示画廊',
              description: '50+种图片艺术风格展示，包括卡通、动漫、像素、迪士尼等',
              url: `${BASE_URL}/gallery`,
              image: stylesConfig.map((s) => s.example),
            }),
          }}
        />
      </div>
    </div>
  );
}
