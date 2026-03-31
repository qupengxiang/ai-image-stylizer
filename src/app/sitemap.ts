import { MetadataRoute } from 'next';

const BASE_URL = 'https://imgart.shop';

const styles = [
  'cute-cartoon',
  'anime-manga',
  'pixel-art',
  'chibi',
  'comic-book',
  'disney',
  'studio-ghibli',
  'pop-art',
  'cartoon-network',
  'stop-motion',
  'retro-cartoon',
  'digital-painting',
];

const blogSlugs = [
  'how-to-make-cartoon-avatar',
  'ai-image-stylizer-tools-comparison',
  'disney-style-photo-tutorial',
  'anime-avatar-guide',
  'pixel-art-photo-effect',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/gallery', '/blog'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const styleRoutes = styles.map((style) => ({
    url: `${BASE_URL}/gallery/${style}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...routes, ...styleRoutes, ...blogRoutes];
}
