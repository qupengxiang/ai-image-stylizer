'use client'

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { styles, aspectRatios, styleCategories, generateImageFilename, type Style } from '@/lib/styles';

// 卡通风格的颜色
const cartoonColors = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFD166',
  background: '#F7FFF7',
  text: '#292F36',
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>('ghibli');
  const [selectedAspect, setSelectedAspect] = useState<string>('1:1');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('hot');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    if (params.has('callback') || params.has('authenticated')) {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.refresh();
    }
  }, [status, router]);

  // 获取当前选中风格
  const getCurrentStyle = (): Style | undefined => {
    return styles.find(s => s.id === selectedStyle);
  };

  // 获取当前提示词（支持自定义）
  const getCurrentPrompt = () => {
    if (selectedStyle === 'custom-style' && customPrompt.trim()) {
      return customPrompt.trim();
    }
    return getCurrentStyle()?.prompt || '';
  };

  // 获取当前尺寸
  const getCurrentAspectRatio = () => {
    const aspect = aspectRatios.find(a => a.id === selectedAspect);
    return aspect?.ratio || '1/1';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setGeneratedImage(null);
      setError(null);
    }
  };

  const handleStyleChange = (styleId: string) => {
    setSelectedStyle(styleId);
    if (styleId !== 'custom-style') {
      setCustomPrompt(''); // 切换到非自定义时清空
    }
    if (generatedImage) {
      setGeneratedImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('请先上传图片');
      return;
    }

    if (status !== 'authenticated') {
      setShowLoginModal(true);
      return;
    }

    const prompt = getCurrentPrompt();
    if (!prompt && selectedStyle === 'custom-style') {
      setError('请输入自定义提示词');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 扣积分
      const deductRes = await fetch('/api/generation', { method: 'POST' });
      const deductData = await deductRes.json();
      
      if (!deductRes.ok) {
        if (deductData.code === 'INSUFFICIENT_CREDITS') {
          setShowVipModal(true);
          setIsLoading(false);
          return;
        }
        setError(deductData.error || '积分扣除失败');
        setIsLoading(false);
        return;
      }
      
      // 根据尺寸计算图片分辨率
      const aspectRatio = getCurrentAspectRatio();
      const [w, h] = aspectRatio.split('/').map(Number);
      const baseSize = 512;
      const width = w > h ? baseSize : Math.round(baseSize * w / h);
      const height = h > w ? baseSize : Math.round(baseSize * h / w);
      
      // 模拟风格迁移
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 生成图片URL
      const style = getCurrentStyle();
      const seed = `${style?.id || 'custom'}-${Date.now()}`;
      const generatedUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;
      
      setGeneratedImage(generatedUrl);
    } catch (err) {
      setError('生成图片时出错，请重试');
      console.error('生成图片错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // SEO友好的下载文件名
  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const style = getCurrentStyle();
      const filename = generateImageFilename(style?.name || 'custom', style?.id || 'custom');
      
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('下载失败:', err);
      window.open(generatedImage, '_blank');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedStyle('ghibli');
    setSelectedAspect('1:1');
    setCustomPrompt('');
    setGeneratedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 分类过滤后的风格
  const filteredStyles = activeCategory === 'all' 
    ? styles 
    : styles.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-8 px-4 sm:px-6 lg:px-8 font-sans overflow-x-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-block mb-6 p-4 bg-white rounded-full shadow-2xl border-4 border-yellow-300 transform rotate-3">
            <svg className="w-16 h-16 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>

          {/* 用户状态 */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {session && (
              <Link
                href="/account"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-full text-sm font-medium transition-colors"
              >
                👤 账户中心
              </Link>
            )}
            {status === "loading" ? (
              <span className="text-white/70 text-sm">加载中...</span>
            ) : session ? (
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || ""} 
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                )}
                <span className="text-white font-medium hidden sm:inline">{session.user?.name}</span>
                <button
                  onClick={() => signIn("google")}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-full text-sm font-medium transition-colors"
                >
                  退出
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-white hover:bg-white/90 text-purple-600 px-4 py-2 rounded-full font-bold shadow-lg transition-colors text-sm"
              >
                使用 Google 登录
              </button>
            )}
          </div>

          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight animate-bounce drop-shadow-lg">
            🎨 ImgArt 🎨
          </h1>
          <p className="text-white text-xl max-w-3xl mx-auto font-medium drop-shadow-md">
            上传图片，选择风格，一键生成超酷的艺术作品！
          </p>
          <p className="text-white/80 text-sm mt-2">支持 50+ 艺术风格 · 图片不存储 · 仅用于生成过程</p>
        </header>

        {/* 3步流程 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Step 1: 选择风格 */}
          <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-4 border-pink-400 p-5 h-[700px] overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
              <h2 className="text-xl font-bold text-[#FF6B6B]">🎭 选择风格</h2>
            </div>
            
            {/* 分类Tab */}
            <div className="flex flex-wrap gap-1 mb-3">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === 'all' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                }`}
              >
                全部
              </button>
              {Object.entries(styleCategories).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === key ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                  }`}
                >
                  {val.name}
                </button>
              ))}
            </div>
            
            {/* 风格列表 */}
            <div className="flex-grow overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {filteredStyles.map(style => (
                  <div
                    key={style.id}
                    onClick={() => handleStyleChange(style.id)}
                    className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      selectedStyle === style.id
                        ? 'ring-2 ring-[#FF6B6B] shadow-lg scale-105'
                        : 'hover:shadow-md border-2 border-gray-200'
                    }`}
                  >
                    <div className="h-20 overflow-hidden bg-gray-100">
                      <img
                        src={style.example}
                        alt={style.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className={`p-2 text-center ${selectedStyle === style.id ? 'bg-[#FF6B6B] text-white' : 'bg-white text-gray-700'}`}>
                      <p className="font-bold text-xs truncate">{style.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: 上传图片 */}
          <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-4 border-blue-400 p-5 h-[700px] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">2</span>
              <h2 className="text-xl font-bold text-[#4ECDC4]">📸 上传图片</h2>
            </div>
            
            {/* 尺寸选择 */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">选择图片尺寸：</p>
              <div className="flex gap-2">
                {aspectRatios.map(ratio => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedAspect(ratio.id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                      selectedAspect === ratio.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-100'
                    }`}
                  >
                    <span>{ratio.icon}</span>
                    <span>{ratio.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* 文件上传 */}
            <div className="flex-grow flex flex-col items-center mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="w-full flex-grow flex flex-col">
                  <p className="text-sm text-[#4ECDC4] mb-2 text-center font-bold">预览：</p>
                  <div className="relative flex-grow bg-gray-100 rounded-xl overflow-hidden border-3 border-dashed border-[#4ECDC4] flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="预览"
                      className="max-w-full max-h-full object-contain p-4"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              ) : (
                <div 
                  className="w-full flex-grow bg-gray-100 rounded-xl flex flex-col items-center justify-center border-3 border-dashed border-[#4ECDC4] cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-14 h-14 text-[#4ECDC4] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-[#292F36] font-bold">点击上传图片</p>
                  <p className="text-xs text-gray-500 mt-1">支持 JPG、PNG 格式</p>
                </div>
              )}
            </div>
            
            {/* 自定义提示词 */}
            {selectedStyle === 'custom-style' && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">自定义提示词：</p>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="输入你想要风格描述..."
                  maxLength={500}
                  className="w-full h-20 p-3 border-2 border-gray-200 rounded-lg text-sm resize-none focus:border-pink-400 focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{customPrompt.length}/500</p>
              </div>
            )}
            
            {/* 操作按钮 */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleGenerate}
                disabled={!selectedFile || isLoading}
                className="btn bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white flex items-center justify-center gap-2 py-3 text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 w-full transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="loading-spinner h-4 w-4"></div>
                    <span>✨ 生成中...</span>
                  </>
                ) : (
                  <span>🚀 生成图片</span>
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="btn bg-gradient-to-r from-[#4ECDC4] to-[#45B7D1] text-white flex items-center justify-center gap-2 py-2 text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 w-full transform hover:scale-105"
              >
                🔄 重置
              </button>
            </div>
          </div>

          {/* Step 3: 生成结果 */}
          <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-4 border-yellow-400 p-5 h-[700px] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">3</span>
              <h2 className="text-xl font-bold text-[#FFD166]">🎊 生成结果</h2>
            </div>
            
            {/* 提示词显示 */}
            <div className="mb-4 p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border-2 border-pink-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-[#FF6B6B]">🎯 当前风格提示词：</h3>
                {selectedStyle === 'custom-style' && (
                  <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded">自定义</span>
                )}
              </div>
              <p className="text-xs text-[#292F36] bg-white p-2 rounded-lg border border-gray-200 line-clamp-3">
                {getCurrentPrompt() || '请选择风格或输入自定义提示词'}
              </p>
            </div>
            
            {/* 生成结果 */}
            {generatedImage ? (
              <div className="flex-grow flex flex-col">
                <div className="relative flex-grow bg-gray-100 rounded-xl overflow-hidden border-4 border-[#4ECDC4] mb-4 flex items-center justify-center">
                  <img
                    src={generatedImage}
                    alt="生成结果"
                    className="max-w-full max-h-full object-contain p-4"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="flex-1 btn bg-gradient-to-r from-[#FFD166] to-[#FFBB33] text-[#292F36] flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    💾 下载
                  </button>
                  <button
                    onClick={() => router.push('/gallery')}
                    className="flex-1 btn bg-gradient-to-r from-[#4ECDC4] to-[#45B7D1] text-white flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    🖼️ 我的图片
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow bg-gray-100 rounded-xl flex flex-col items-center justify-center border-4 border-dashed border-[#4ECDC4]">
                <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className="text-sm text-gray-500 text-center font-medium px-4">
                  上传图片并选择风格后，点击生成按钮查看结果
                </p>
              </div>
            )}
            
            {/* 错误提示 */}
            {error && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-xl border-2 border-red-300">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="font-bold text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-white">
          <nav className="mb-4 flex justify-center gap-6 text-sm">
            <Link href="/gallery" className="hover:underline">🎨 风格展示</Link>
            <Link href="/blog" className="hover:underline">📚 博客教程</Link>
            <a href="/sitemap.xml" className="hover:underline">Sitemap</a>
          </nav>
          <p className="mb-2 font-bold text-lg drop-shadow-md">© 2024 ImgArt</p>
          <p className="text-sm text-white/80 drop-shadow-sm">🎨 图片不存储，仅用于生成过程 🎨</p>
        </footer>

        {/* 登录提示弹窗 */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">请先登录</h2>
              <p className="text-gray-600 mb-6">登录后才能使用 AI 图片生成功能</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-bold transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => signIn("google")}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google 登录
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIP 促销弹窗 */}
        {showVipModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👑</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">积分不足</h2>
                <p className="text-gray-600">升级 VIP 会员，享受更多权益</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>生成图片 8 折优惠</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>专属艺术风格</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>优先排队生成</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>每日登录送积分</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-purple-50 rounded-xl p-4 text-center border-2 border-purple-200">
                  <p className="text-purple-600 font-bold">月卡</p>
                  <p className="text-2xl font-bold text-purple-600">¥29</p>
                  <p className="text-xs text-gray-500">500积分</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl p-4 text-center border-2 border-yellow-300 text-white">
                  <p className="font-bold">季卡</p>
                  <p className="text-2xl font-bold">¥79</p>
                  <p className="text-xs opacity-90">1500积分</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowVipModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-bold transition-colors"
                >
                  稍后再说
                </button>
                <button
                  onClick={() => {
                    setShowVipModal(false);
                    router.push('/account/vip');
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-xl font-bold transition-all"
                >
                  立即升级
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
