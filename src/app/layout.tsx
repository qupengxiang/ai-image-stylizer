import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import '../styles/globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

const BASE_URL = 'https://imgart.shop';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'ImgArt - AI图片转卡通风格 | 50+艺术风格免费在线生成',
    template: '%s | ImgArt - AI图片风格生成器',
  },
  description: '免费在线AI工具，将你的照片一键转换成吉卜力、皮克斯、像素、迪士尼、动漫等50+种艺术风格。无需注册，直接使用，图片仅用于生成过程不存储。',
  keywords: [
    // 核心关键词
    'AI图片转卡通',
    '照片变动漫',
    '图片风格转换',
    'AI头像生成',
    '卡通头像制作',
    // 风格关键词
    '吉卜力风格',
    '皮克斯3D风格',
    '迪士尼风格',
    '像素风格',
    '动漫头像',
    'Q版头像',
    '手办照片',
    '乐高风格',
    '老照片风格',
    // 通用关键词
    '在线图片处理',
    '免费AI工具',
    '照片艺术化',
    'AI Art Generator',
    'cartoon maker',
    'anime filter',
    'photo to cartoon',
    'AI portrait',
    // 长尾关键词
    '如何把照片变成卡通',
    '免费在线照片风格转换',
    'AI生成艺术图片',
    '一键生成卡通头像',
  ],
  authors: [{ name: 'ImgArt', url: BASE_URL }],
  creator: 'ImgArt',
  publisher: 'ImgArt',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: ['en_US'],
    url: BASE_URL,
    siteName: 'ImgArt',
    title: 'ImgArt - AI图片转卡通风格 | 50+艺术风格免费在线生成',
    description: '免费在线AI工具，将你的照片一键转换成吉卜力、皮克斯、像素、迪士尼等50+种艺术风格',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ImgArt - AI图片风格生成器',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ImgArt - AI图片转卡通风格 | 50+艺术风格',
    description: '免费在线AI工具，将照片一键转换成卡通、动漫、像素等艺术风格',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: 'google-site-verification-file',
  },
  other: {
    'gtag': 'G-YPV5461W5Z',
  },
  category: 'AI Image Generation',
  classification: 'Online Tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ImgArt - AI图片风格生成器',
    description: '免费在线AI工具，将照片一键转换成卡通、动漫、像素、迪士尼等50+种艺术风格',
    url: BASE_URL,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
    browserRequirements: 'Requires JavaScript. Requires modern browser.',
    softwareVersion: '1.0',
    maintainer: {
      '@type': 'Organization',
      name: 'ImgArt',
      url: BASE_URL,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '首页',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '风格展示',
        item: `${BASE_URL}/gallery`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: '用户中心',
        item: `${BASE_URL}/account`,
      },
    ],
  };

  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-YPV5461W5Z" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YPV5461W5Z');
          `}
        </Script>
      </body>
    </html>
  );
}
