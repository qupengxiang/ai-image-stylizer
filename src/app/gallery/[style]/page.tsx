import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

// 风格元数据配置
const stylesConfig: Record<string, {
  name: string;
  nameEn: string;
  description: string;
  prompt: string;
  keywords: string[];
  example: string;
}> = {
  'cute-cartoon': {
    name: '可爱卡通',
    nameEn: 'Cute Cartoon',
    description: '将你的照片转换成可爱的Q版卡通风格，大眼睛、圆润线条、萌系风格。非常适合制作卡通头像和社交媒体头像。',
    prompt: '可爱卡通风格，Q版，大眼睛，色彩鲜艳，圆润线条，萌系',
    keywords: ['可爱卡通头像', 'Q版卡通', '卡通头像制作', '萌系图片', '可爱头像生成'],
    example: 'https://picsum.photos/id/237/512/512',
  },
  'anime-manga': {
    name: '动漫漫画',
    nameEn: 'Anime Manga',
    description: '将照片转换成日式动漫漫画风格，清晰线条、鲜明色彩、经典二次元效果。喜欢日本动漫的用户首选。',
    prompt: '动漫漫画风格，日本风格，大眼睛，清晰线条，色彩鲜明，二次元',
    keywords: ['动漫头像', '日式漫画风格', '二次元图片', 'Anime头像', '漫画滤镜'],
    example: 'https://picsum.photos/id/24/512/512',
  },
  'pixel-art': {
    name: '像素艺术',
    nameEn: 'Pixel Art',
    description: '将照片转换成复古像素艺术风格，8位或16位游戏风格，块状像素效果。满满的怀旧游戏感。',
    prompt: '像素艺术风格，8位或16位游戏风格，块状像素，复古感，鲜艳色彩',
    keywords: ['像素风格图片', '像素头像', '8位风格', '复古像素', '游戏风格图片'],
    example: 'https://picsum.photos/id/20/512/512',
  },
  'chibi': {
    name: 'Q版人物',
    nameEn: 'Chibi Character',
    description: '将照片转换成Q版人物风格，大头小身的经典可爱造型，圆润可爱，适合各种可爱风格爱好者。',
    prompt: 'Q版人物风格，头大身体小，可爱，圆润，色彩鲜艳，萌系',
    keywords: ['Q版头像', 'Q版人物', '大头娃娃风格', '可爱Q版', '迷你人物图片'],
    example: 'https://picsum.photos/id/64/512/512',
  },
  'comic-book': {
    name: '漫画书',
    nameEn: 'Comic Book',
    description: '将照片转换成美式漫画书风格，大胆线条、鲜明色彩、夸张表情。打造属于你的超级英雄风格。',
    prompt: '漫画书风格，美国漫画，大胆线条，鲜明色彩，夸张表情，对话框',
    keywords: ['漫画风格照片', '美式漫画', '超级英雄风格', '漫画滤镜', '漫画效果'],
    example: 'https://picsum.photos/id/91/512/512',
  },
  'disney': {
    name: '迪士尼',
    nameEn: 'Disney Style',
    description: '将照片转换成迪士尼经典动画风格，圆润造型、明亮色彩、童话感。圆你的公主/王子梦。',
    prompt: '迪士尼风格，经典动画，圆润造型，明亮色彩，童话感，温馨',
    keywords: ['迪士尼风格', '迪士尼公主头像', '童话风格', '卡通公主', '梦幻风格图片'],
    example: 'https://picsum.photos/id/102/512/512',
  },
  'studio-ghibli': {
    name: '吉卜力',
    nameEn: 'Studio Ghibli',
    description: '将照片转换成吉卜力工作室风格，手绘感、细腻色彩、自然场景。宫崎骏动漫的独特魅力。',
    prompt: '吉卜力工作室风格，手绘感，细腻色彩，自然场景，奇幻元素',
    keywords: ['吉卜力风格', '宫崎骏风格', '天空之城风格', '动漫滤镜', '手绘风格图片'],
    example: 'https://picsum.photos/id/106/512/512',
  },
  'pop-art': {
    name: '波普艺术',
    nameEn: 'Pop Art',
    description: '将照片转换成波普艺术风格，鲜艳色彩、重复图案、流行文化元素。Andy Warhol 风格的艺术效果。',
    prompt: '波普艺术风格，鲜艳色彩，重复图案，流行文化元素，对比强烈',
    keywords: ['波普艺术', '波普风格头像', '安迪沃霍尔风格', '流行艺术', '艺术风格照片'],
    example: 'https://picsum.photos/id/133/512/512',
  },
  'cartoon-network': {
    name: '卡通网络',
    nameEn: 'Cartoon Network',
    description: '将照片转换成卡通网络风格，夸张造型、鲜明色彩、现代卡通效果。充满活力和幽默感。',
    prompt: '卡通网络风格，夸张造型，鲜明色彩，幽默元素，现代卡通',
    keywords: ['卡通网络风格', '现代卡通', '夸张头像', '活力卡通', '幽默风格'],
    example: 'https://picsum.photos/id/169/512/512',
  },
  'stop-motion': {
    name: '定格动画',
    nameEn: 'Stop Motion',
    description: '将照片转换成定格动画风格，黏土感、手工制作感、温暖色调。独特的立体动画效果。',
    prompt: '定格动画风格，黏土感，手工制作感，温暖色调，立体效果',
    keywords: ['定格动画风格', '黏土风格', '手工动画', '立体风格图片', '独特头像'],
    example: 'https://picsum.photos/id/177/512/512',
  },
  'retro-cartoon': {
    name: '复古卡通',
    nameEn: 'Retro Cartoon',
    description: '将照片转换成复古卡通风格，1950年代风格、简洁线条、柔和色彩。经典动画的怀旧魅力。',
    prompt: '复古卡通风格，1950年代风格，简洁线条，柔和色彩，经典动画感',
    keywords: ['复古卡通', '复古风格头像', '怀旧卡通', '经典动画风格', '复古滤镜'],
    example: 'https://picsum.photos/id/180/512/512',
  },
  'digital-painting': {
    name: '数字绘画',
    nameEn: 'Digital Painting',
    description: '将照片转换成数字绘画风格，CG感、细腻纹理、丰富色彩。现代数字艺术的精美效果。',
    prompt: '数字绘画风格，CG感，细腻纹理，丰富色彩，现代艺术感',
    keywords: ['数字绘画', 'CG风格', '数字艺术头像', '电脑绘画', '现代艺术风格'],
    example: 'https://picsum.photos/id/188/512/512',
  },
};

const allStyles = Object.entries(stylesConfig).map(([id, config]) => ({
  id,
  ...config,
}));

// 生成所有风格页的静态路径
export async function generateStaticParams() {
  return Object.keys(stylesConfig).map((style) => ({
    style,
  }));
}

// 生成每个风格页的SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ style: string }>;
}): Promise<Metadata> {
  const { style } = await params;
  const config = stylesConfig[style];

  if (!config) {
    return {
      title: '风格不存在',
    };
  }

  const url = `https://imgart.shop/gallery/${style}`;

  return {
    title: `${config.name}风格 - AI图片转换 | ImgArt`,
    description: `使用ImgArt的AI工具，将你的照片一键转换成${config.name}风格。${config.description} 免费使用，立即体验！`,
    keywords: [...config.keywords, 'AI图片风格转换', '在线生成', 'ImgArt'],
    openGraph: {
      title: `${config.name}风格 | ImgArt - AI图片风格生成器`,
      description: `将照片转换成${config.name}风格，${config.description}`,
      url,
      images: [
        {
          url: config.example,
          width: 512,
          height: 512,
          alt: `${config.name}风格示例`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${config.name}风格 | ImgArt`,
      description: `将照片转换成${config.name}风格，免费在线体验`,
      images: [config.example],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function GalleryStylePage({
  params,
}: {
  params: Promise<{ style: string }>;
}) {
  const { style } = await params;
  const config = stylesConfig[style];

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">风格不存在</h1>
          <Link href="/" className="text-purple-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white mb-8 hover:underline"
        >
          ← 返回首页
        </Link>

        {/* 风格信息卡片 */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="md:flex">
            {/* 示例图 */}
            <div className="md:w-1/2">
              <img
                src={config.example}
                alt={`${config.name}风格示例`}
                className="w-full h-80 md:h-full object-cover"
              />
            </div>

            {/* 信息 */}
            <div className="md:w-1/2 p-8">
              <div className="inline-block bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-bold mb-4">
                {config.nameEn}
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                🎨 {config.name}风格
              </h1>
              <p className="text-gray-600 mb-6">{config.description}</p>

              {/* 提示词 */}
              <div className="bg-gray-100 rounded-xl p-4 mb-6">
                <p className="text-sm font-bold text-gray-700 mb-2">🎯 AI提示词：</p>
                <p className="text-sm text-gray-600">{config.prompt}</p>
              </div>

              {/* 操作按钮 */}
              <Link
                href={`/?style=${style}`}
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
              >
                🚀 立即使用此风格
              </Link>
            </div>
          </div>
        </div>

        {/* 其他风格推荐 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">🌟 其他风格</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allStyles
              .filter((s) => s.id !== style)
              .slice(0, 4)
              .map((s) => (
                <Link
                  key={s.id}
                  href={`/gallery/${s.id}`}
                  className="group"
                >
                  <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                    <img
                      src={s.example}
                      alt={s.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="bg-gray-800 text-white text-center py-2 text-sm font-bold group-hover:bg-pink-500 transition-colors">
                      {s.name}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-white bg-gray-800 px-6 py-2 rounded-full font-bold hover:bg-gray-700 transition-colors inline-block"
            >
              查看全部风格 →
            </Link>
          </div>
        </div>

        {/* FAQ区块 - 提升SEO深度 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">❓常见问题</h2>
          <div className="space-y-4">
            <details className="group">
              <summary className="font-bold text-gray-700 cursor-pointer list-none flex justify-between items-center">
                如何使用{config.name}风格？
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-2 pl-4 border-l-2 border-pink-300">
                只需上传一张照片，选择{config.name}风格，点击生成按钮即可。图片仅在生成过程中使用，不会被存储。
              </p>
            </details>
            <details className="group">
              <summary className="font-bold text-gray-700 cursor-pointer list-none flex justify-between items-center">
                {config.name}风格适合什么场景？
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-2 pl-4 border-l-2 border-pink-300">
                非常适合制作社交媒体头像、头像素材、设计灵感参考等。各种创意场景都可以尝试！
              </p>
            </details>
            <details className="group">
              <summary className="font-bold text-gray-700 cursor-pointer list-none flex justify-between items-center">
                {config.name}风格生成收费吗？
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-2 pl-4 border-l-2 border-pink-300">
                ImgArt提供免费试用次数。成为VIP会员可享受更多生成次数和专属风格。
              </p>
            </details>
          </div>
        </div>

        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: `ImgArt - ${config.name}风格`,
              description: config.description,
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'CNY',
              },
              image: config.example,
            }),
          }}
        />
      </div>
    </div>
  );
}
