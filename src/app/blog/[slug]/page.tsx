import type { Metadata } from 'next';
import Link from 'next/link';

const BASE_URL = 'https://imgart.shop';

const blogPosts = {
  'how-to-make-cartoon-avatar': {
    title: '如何用AI制作卡通头像？完整教程（2024）',
    description: '手把手教你用ImgArt在线工具，将普通照片一键转换成可爱的卡通头像。无需设计基础，免费使用，适合社交媒体头像制作。',
    keywords: ['制作卡通头像', 'AI卡通头像', '照片转卡通', '免费卡通头像', '社交媒体头像'],
    date: '2024-03-15',
    readTime: '5分钟',
    content: `
## 什么是卡通头像？

卡通头像是指以卡通/动漫风格呈现的个人头像。与传统摄影不同，卡通头像具有独特的设计感和趣味性，非常适合用于：

- **社交媒体头像**：微信、微博、Twitter、Instagram
- **游戏账号头像**：Steam、Discord、各种游戏平台
- **论坛和社区头像**：Reddit、贴吧、豆瓣等
- **工作资料**：领英、简历等

## 使用ImgArt制作卡通头像的步骤

### 第一步：选择工具

打开 ImgArt（https://imgart.shop），这是一个免费的在线AI图片风格转换工具。

### 第二步：上传照片

点击「上传图片」按钮，选择一张清晰的照片。建议：
- 正脸照片效果最好
- 光线均匀
- 脸部特征清晰

### 第三步：选择风格

ImgArt提供多种卡通风格可选：

- **可爱卡通**：圆润线条，萌系风格
- **Q版人物**：大头小身，非常可爱
- **动漫漫画**：日式二次元风格
- **迪士尼风格**：经典公主/王子风格

### 第四步：生成并下载

点击「生成图片」，等待AI处理完成（通常只需几秒），然后下载你的卡通头像！

## 常见问题

**Q: 照片会被存储吗？**
A: 不会。ImgArt承诺图片仅用于生成过程，处理后立即删除，不会有任何存储。

**Q: 可以商用吗？**
A: 生成的头像可免费用于个人用途。商业用途建议查看具体授权条款。

**Q: 需要注册吗？**
A: 不需要注册即可使用基础功能。注册后可获得更多生成次数。

## 为什么选择AI生成卡通头像？

1. **快速**：几秒钟完成，无需等待设计师
2. **便宜**：免费基础功能，性价比高
3. **多样**：50+种风格可选
4. **独特**：每张都是AI定制，不会有相同撞图

## 总结

AI技术让卡通头像制作变得前所未有的简单。只需上传照片，选择喜欢的风格，就能立即获得一张独一无二的卡通头像。快去试试吧！🚀
    `,
  },
  'ai-image-stylizer-tools-comparison': {
    title: '2024年最佳AI图片风格化工具对比评测',
    description: '对比评测ImgArt、Midjourney、DALL-E等主流AI图片风格化工具，从功能、价格、易用性等维度全面分析，帮你选择最适合的工具。',
    keywords: ['AI图片工具对比', 'Midjourney评测', 'DALL-E对比', '图片风格化工具', 'AI Art Generator比较'],
    date: '2024-03-10',
    readTime: '8分钟',
    content: `
## AI图片风格化工具全景

随着AI技术的发展，市面上出现了越来越多图片风格化工具。本文对比几款主流产品，帮你找到最适合自己的选择。

## 工具对比表

| 工具 | 风格数量 | 价格 | 易用性 | 中文支持 |
|------|---------|------|--------|----------|
| ImgArt | 50+ | 免费基础 | ⭐⭐⭐⭐⭐ | 优秀 |
| Midjourney | 无限 | 付费 | ⭐⭐⭐ | 一般 |
| DALL-E | 无限 | 按次付费 | ⭐⭐⭐⭐ | 一般 |
| Stable Diffusion | 无限 | 免费 | ⭐⭐ | 需配置 |

## ImgArt 优势分析

### 1. 专为亚洲用户优化
ImgArt针对中文用户设计，界面简洁，操作直观，无需翻墙。

### 2. 风格丰富且实用
50+种风格涵盖卡通、动漫、像素、复古等流行风格，每个风格都经过精心调校。

### 3. 免费使用
基础功能完全免费，对于普通用户来说完全够用。

### 4. 无需学习成本
直接上传照片选择风格，30秒出图，不像Midjourney需要学习复杂的prompts指令。

## 其他工具特点

### Midjourney
**优点**：风格无限，艺术性强
**缺点**：需要Discord，操作复杂，费用较高
**适合**：专业设计师和艺术创作者

### DALL-E
**优点**：OpenAI技术，生成质量高
**缺点**：按次付费，价格较贵
**适合**：企业级应用

### Stable Diffusion
**优点**：完全免费，可本地部署
**缺点**：需要技术基础，硬件要求高
**适合**：有技术背景的用户

## 如何选择？

- **普通用户**：选择ImgArt，简单快捷免费
- **专业设计师**：Midjourney + ImgArt组合使用
- **企业用户**：DALL-E API集成

## 结论

ImgArt作为专注于图片风格转换的工具，在易用性、中文支持、性价比方面都有明显优势。非常适合普通用户快速制作各种风格的头像和图片。推荐尝试！🎨
    `,
  },
  'disney-style-photo-tutorial': {
    title: '如何制作迪士尼风格照片？AI一键生成教程',
    description: '迪士尼公主/王子梦不再遥远！使用ImgArt AI工具，将你的照片转换成梦幻的迪士尼动画风格，圆你的童话梦。',
    keywords: ['迪士尼风格照片', '迪士尼头像制作', '公主风格图片', '童话风格滤镜', 'AI迪士尼效果'],
    date: '2024-03-08',
    readTime: '4分钟',
    content: `
## 迪士尼风格照片的魅力

每个人都曾有过童话梦。迪士尼风格的照片以经典动画为灵感，圆润的造型、明亮的色彩、温馨的氛围，让你的照片瞬间充满魔法感。

## 使用ImgArt生成迪士尼风格照片

### 第一步：访问ImgArt

打开 https://imgart.shop ，点击「迪士尼」风格。

### 第二步：准备照片

选择一张清晰的正脸照片。迪士尼风格最适合：
- 带微笑的生活照
- 户外自然光照片
- 表情愉悦的自拍

### 第三步：上传并生成

上传照片，选择迪士尼风格，点击生成。AI会在几秒内完成转换！

## 迪士尼风格适合的场景

### 1. 社交媒体头像
让你的Instagram、微博头像与众不同，充满童话感。

### 2. 情侣照
和另一半一起制作迪士尼风格照片，梦幻又浪漫。

### 3. 家庭照
全家一起变身童话角色，留存美好回忆。

### 4. 生日贺卡
用迪士尼风格照片制作个性化生日贺卡。

## 与专业修图对比

| 对比项 | 传统PS修图 | ImgArt AI |
|--------|-----------|-----------|
| 时间 | 2-4小时 | 3秒 |
| 费用 | 200-500元 | 免费 |
| 效果 | 依赖设计师 | 专业级 |
| 门槛 | 需要学习 | 人人会用 |

## 温馨提示

迪士尼风格照片仅供个人娱乐和审美使用，如需商用请注意相关版权问题。

## 立即尝试

点击下方按钮，开始你的童话之旅！👑✨
    `,
  },
  'anime-avatar-guide': {
    title: '二次元动漫头像制作指南：如何用AI把照片变成动漫？',
    description: '详细讲解如何用AI工具将普通照片转换成精美的二次元动漫头像，包括风格选择、技巧分享、常见问题解答。',
    keywords: ['动漫头像制作', '二次元图片', '照片转动漫', 'Anime头像教程', 'AI动漫滤镜'],
    date: '2024-03-05',
    readTime: '6分钟',
    content: `
## 为什么越来越多人喜欢动漫头像？

二次元文化的流行让动漫头像成为Z世代的标配。相比真实照片，动漫头像更加可爱、有个性，而且能保护隐私。

## AI生成动漫头像的原理

ImgArt使用的AI模型经过大量动漫图片训练，能够：
1. 识别人物面部特征
2. 应用动漫绘画风格
3. 保持原图神态的同时完成风格转换

## 推荐使用的风格

### 1. 日式动漫漫画（Anime Manga）
最标准的日漫风格，大眼睛、清晰线条、鲜明色彩。

### 2. 吉卜力工作室（Ghibli）
宫崎骏动画风格，手绘感、细腻色彩、自然场景。

### 3. Q版人物（Chibi）
大头小身的可爱风格，适合软萌系爱好者。

### 4. 卡通网络（Cartoon Network）
现代卡通风格，夸张有趣。

## 提高效果的技巧

### 照片选择
- ✅ 正面照效果最好
- ✅ 光线均匀
- ✅ 表情自然带微笑
- ❌ 避免侧脸过度
- ❌ 避免戴墨镜/口罩

### 风格选择
- 女生推荐：可爱卡通、Q版人物、吉卜力
- 男生推荐：动漫漫画、漫画书、数字绘画
- 通用：卡通网络、像素艺术

## 与专业画师的对比

| 对比项 | 专业画师 | ImgArt AI |
|--------|---------|-----------|
| 耗时 | 3-7天 | 3秒 |
| 费用 | 200-2000元 | 免费 |
| 修改 | 可修改 | 重新生成 |
| 数量 | 1张 | 无限 |

## 常见问题

**Q: 生成的照片模糊怎么办？**
A: 上传更高分辨率的原图。

**Q: 效果不满意怎么办？**
A: 可以多次生成，每次结果都会略有不同。

**Q: 可以商用吗？**
A: 个人用途完全没问题。

## 结论

AI技术让动漫头像制作变得前所未有的简单高效。不需要任何绘画基础，只需一张照片，就能立即拥有专属的动漫头像。快去试试吧！🎌
    `,
  },
  'pixel-art-photo-effect': {
    title: '像素风格照片怎么制作？复古8-bit头像教程',
    description: '像素艺术（Pixel Art）近几年非常流行，本文教你如何用AI工具将照片一键转换成复古的8位/16位像素游戏风格。',
    keywords: ['像素风格照片', '像素头像制作', '8-bit风格', '复古游戏头像', '像素化图片工具'],
    date: '2024-03-01',
    readTime: '4分钟',
    content: `
## 像素艺术的复古魅力

从《超级马里奥》到《我的世界》，像素艺术一直是游戏和设计领域的经典风格。越来越多人开始喜欢这种复古、怀旧、充满游戏感的视觉效果。

## 像素风格的特点

- **块状像素**：由小方块组成的图像
- **有限色彩**：8位/16位游戏的色彩限制
- **怀旧感**：满满的80/90年代游戏回忆
- **独特美感**：简约但不简单

## 如何制作像素风格照片

使用 ImgArt 的「像素艺术」风格，只需：
1. 上传照片
2. 选择「像素艺术」风格
3. 点击生成

3秒钟就能完成转换！

## 像素风格适合的场景

### 游戏玩家头像
完美的Steam、Discord、Switch头像。

### 复古主题账号
如果你运营复古游戏/怀旧内容相关账号，像素头像再合适不过。

### 创意营销素材
品牌营销、创意海报、商品设计等。

### 情侣/闺蜜头像
和对象/闺蜜一起用像素风格，独特又有趣！

## 进阶技巧

### 调整原图裁剪
像素风格对脸部特写效果最好，建议裁剪为正方形。

### 选择合适的原图
- ✅ 颜色鲜艳的照片
- ✅ 清晰的前景主体
- ✅ 简单背景

### 多次生成
像素化的程度和效果每次会略有不同，多试几次找到最喜欢的！

## 像素风格参数参考

ImgArt的像素艺术风格采用以下AI提示词：
> 像素艺术风格，8位或16位游戏风格，块状像素，复古感，鲜艳色彩

这个风格特别适合：
- 宠物照片
- 美食照片
- 风景照片
- 个人头像

## 立即体验

点击 ImgArt 开始制作你的像素头像！🎮
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return { title: '文章不存在' };
  }

  const url = `${BASE_URL}/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: ['ImgArt'],
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">文章不存在</h1>
          <Link href="/blog" className="text-purple-600 hover:underline">
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  // 简单的Markdown转HTML（处理##标题和段落）
  const contentHtml = post.content
    .split('\n')
    .map((line) => {
      if (line.startsWith('## ')) {
        return `<h2 class="text-2xl font-bold text-gray-800 mt-8 mb-4">${line.slice(3)}</h2>`;
      }
      if (line.startsWith('### ')) {
        return `<h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">${line.slice(4)}</h3>`;
      }
      if (line.startsWith('- ')) {
        return `<li class="ml-4 mb-2 text-gray-600">${line.slice(2)}</li>`;
      }
      if (line.startsWith('| ')) {
        return `<tr class="border-b border-gray-200"><td class="p-2">${line.slice(2).split('|').join('</td><td class="p-2">')}</td></tr>`;
      }
      if (line.trim() === '') {
        return '<br/>';
      }
      // 处理加粗 **text**
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-800">$1</strong>');
      return `<p class="text-gray-600 mb-4">${line}</p>`;
    })
    .join('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 返回链接 */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-white mb-8 hover:underline"
        >
          ← 返回博客
        </Link>

        {/* 文章卡片 */}
        <article className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <header className="p-8 border-b border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <time dateTime={post.date}>{post.date}</time>
              <span>•</span>
              <span>{post.readTime}阅读</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {post.keywords.slice(0, 5).map((kw) => (
                <span
                  key={kw}
                  className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm"
                >
                  {kw}
                </span>
              ))}
            </div>
          </header>

          {/* 内容 */}
          <div
            className="p-8 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* CTA */}
          <footer className="p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-gray-100">
            <div className="text-center">
              <p className="text-gray-600 mb-4">喜欢这篇文章？立即体验ImgArt！</p>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
              >
                🚀 开始创作
              </Link>
            </div>
          </footer>
        </article>

        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: post.description,
              image: 'https://imgart.shop/og-image.png',
              datePublished: post.date,
              author: {
                '@type': 'Organization',
                name: 'ImgArt',
              },
              publisher: {
                '@type': 'Organization',
                name: 'ImgArt',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://imgart.shop/logo.png',
                },
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
