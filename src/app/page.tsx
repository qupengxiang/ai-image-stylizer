'use client'

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { styles, aspectRatios, styleCategories, generateImageFilename, type Style } from '@/lib/styles';

export default function Home() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  
  // 状态
  const [selectedStyle, setSelectedStyle] = useState<string>('ghibli');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedAspect, setSelectedAspect] = useState<string>('1:1');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 生成结果
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 弹窗
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  
  // 分类
  const [activeCategory, setActiveCategory] = useState<string>('hot');
  
  // 文件上传
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // 初始化
  if (!mounted) {
    if (typeof window !== 'undefined') {
      setMounted(true);
      const params = new URLSearchParams(window.location.search);
      const styleParam = params.get('style');
      if (styleParam && styles.find(s => s.id === styleParam)) {
        setSelectedStyle(styleParam);
      }
    }
  }

  // 获取当前风格
  const getCurrentStyle = (): Style | undefined => {
    return styles.find(s => s.id === selectedStyle);
  };

  // 获取提示词
  const getPrompt = () => {
    if (selectedStyle === 'custom-style' && customPrompt.trim()) {
      return customPrompt.trim();
    }
    return getCurrentStyle()?.prompt || '';
  };

  // 文件处理
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('请上传图片文件（JPG、PNG）');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setGeneratedImage(null);
    setShowSuccess(false);
  }, []);

  // 拖拽处理
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 点击上传
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // 生成图片
  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('请先上传图片');
      return;
    }

    if (status !== 'authenticated') {
      setShowLoginModal(true);
      return;
    }

    const prompt = getPrompt();
    if (!prompt) {
      setError('请选择风格或输入自定义提示词');
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

      // 模拟生成延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 生成图片URL（实际项目中这里会是真实的AI生成结果）
      const aspectRatio = selectedAspect;
      const [w, h] = aspectRatio.split(':').map(Number);
      const baseSize = 512;
      const width = w > h ? baseSize : Math.round(baseSize * w / h);
      const height = h > w ? baseSize : Math.round(baseSize * h / w);
      const seed = `${selectedStyle}-${Date.now()}`;
      const resultUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;

      // 保存生成记录
      try {
        await fetch('/api/generation/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            styleId: selectedStyle,
            styleName: getCurrentStyle()?.name,
            prompt: prompt,
            resultUrl: resultUrl,
          })
        });
      } catch (saveError) {
        console.error('保存生成记录失败:', saveError);
      }

      // 显示结果
      setGeneratedImage(resultUrl);
      setShowSuccess(true);
    } catch (err) {
      setError('生成图片时出错，请重试');
      console.error('生成图片错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 下载图片状态
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    if (!generatedImage || isDownloading) return;

    const style = getCurrentStyle();
    const filename = generateImageFilename(style?.name || 'custom', style?.id || 'custom');

    // 禁用按钮防止重复点击
    setIsDownloading(true);
    setDownloadSuccess(false);

    // 方法1: 直接通过 a 标签 + target=_blank 触发下载
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 延迟反馈
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 800);
  };

  // 重置
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedStyle('ghibli');
    setSelectedAspect('1:1');
    setCustomPrompt('');
    setError(null);
    setGeneratedImage(null);
    setShowSuccess(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 分类过滤
  const filteredStyles = activeCategory === 'all' 
    ? styles 
    : styles.filter(s => s.category === activeCategory);

  // 热门标记的风格ID
  const hotStyleIds = ['ghibli', 'selfie', 'old-photo', 'figure-photo', 'q-version', 'pixar-3d', 'japan-figure', 'lego', '3d-q-version'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            🎨 ArtFlow
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/my-images" className="text-gray-600 hover:text-pink-500 text-sm font-medium">
              📷 我的图片
            </Link>
            {session ? (
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                )}
                <span className="text-gray-600 text-sm">{session.user?.name}</span>
                <Link href="/account" className="text-pink-500 hover:text-pink-600 text-sm font-medium">
                  账户中心
                </Link>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                登录
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - 3步流程 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 步骤指示器 */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4">
            <div className="flex items-center justify-between text-sm font-medium">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">1</span>
                <span>选择风格</span>
              </div>
              <div className="flex-1 h-px bg-white/30 mx-4" />
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">2</span>
                <span>上传照片</span>
              </div>
              <div className="flex-1 h-px bg-white/30 mx-4" />
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${showSuccess ? 'bg-green-400' : 'bg-white/20'}`}>
                  {showSuccess ? '✓' : '3'}
                </span>
                <span>图片转换</span>
              </div>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-6">
            {/* Step 1: 选择风格 */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                为您的照片选择一种艺术风格进行转换
              </h2>
              
              {/* 分类Tab */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === 'all' 
                      ? 'bg-pink-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                  }`}
                >
                  全部
                </button>
                {Object.entries(styleCategories).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === key 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                    }`}
                  >
                    {val.name}
                  </button>
                ))}
              </div>
              
              {/* 风格网格 */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-64 overflow-y-auto p-1">
                {filteredStyles.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                      selectedStyle === style.id
                        ? 'ring-2 ring-pink-500 shadow-lg scale-105'
                        : 'hover:shadow-md border border-gray-200'
                    }`}
                  >
                    <div className="aspect-square">
                      <img
                        src={style.example}
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {hotStyleIds.includes(style.id) && (
                      <span className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1.5 py-0.5">
                        热门
                      </span>
                    )}
                    <div className={`text-center py-1 text-xs ${
                      selectedStyle === style.id ? 'bg-pink-500 text-white' : 'bg-gray-50 text-gray-700'
                    }`}>
                      {style.name}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Step 2: 上传照片 */}
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                上传您想要转换的照片
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* 上传区域 */}
                <div>
                  <div
                    ref={dropZoneRef}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      previewUrl 
                        ? 'border-pink-300 bg-pink-50' 
                        : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="预览"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setGeneratedImage(null);
                            setShowSuccess(false);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl mb-2">📤</div>
                        <p className="text-gray-600 font-medium">拖放图片到这里，或点击浏览文件</p>
                        <p className="text-gray-400 text-sm mt-1">支持JPG、PNG格式 - 最大5MB</p>
                      </>
                    )}
                  </div>
                </div>
                
                {/* 尺寸选择 */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">选择图片尺寸</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {aspectRatios.map((ratio) => (
                      <button
                        key={ratio.id}
                        onClick={() => setSelectedAspect(ratio.id)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                          selectedAspect === ratio.id
                            ? 'bg-pink-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-pink-100'
                        }`}
                      >
                        <span className="text-lg">{ratio.icon}</span>
                        <span>{ratio.name}</span>
                        <span className="text-xs opacity-75">{ratio.id}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* 自定义提示词 */}
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-700 mb-2">自定义提示词（可自行修改）</h3>
                    <textarea
                      value={selectedStyle === 'custom-style' ? customPrompt : getCurrentStyle()?.prompt || ''}
                      onChange={(e) => {
                        if (selectedStyle === 'custom-style') {
                          setCustomPrompt(e.target.value);
                        }
                      }}
                      disabled={selectedStyle !== 'custom-style'}
                      placeholder={selectedStyle === 'custom-style' ? '输入你想要风格描述...' : '选择风格后自动填充，可切换到自定义模式修改'}
                      maxLength={500}
                      className={`w-full h-24 p-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                        selectedStyle === 'custom-style' ? 'border-pink-300' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {(selectedStyle === 'custom-style' ? customPrompt : getCurrentStyle()?.prompt || '').length}/500
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 3: 图片转换 */}
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-4">图片转换</h2>
              
              {/* 生成结果展示 */}
              {showSuccess && generatedImage ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-xl">✓</span>
                    <div>
                      <p className="font-bold text-green-800">图片生成成功！</p>
                      <p className="text-sm text-green-600">点击下载保存图片，7天内有效</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* 生成结果图 */}
                    <div className="flex-1">
                      <div className="bg-white rounded-xl overflow-hidden border-2 border-green-200">
                        <img
                          src={generatedImage}
                          alt="生成结果"
                          className="w-full max-h-64 object-contain"
                        />
                      </div>
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex md:flex-col gap-3">
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`flex-1 md:flex-none text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          downloadSuccess 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : isDownloading 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-pink-500 hover:bg-pink-600'
                        }`}
                      >
                        {isDownloading ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            <span>下载中...</span>
                          </>
                        ) : downloadSuccess ? (
                          <>
                            <span>✓</span>
                            <span>已下载</span>
                          </>
                        ) : (
                          <>
                            <span>💾</span>
                            <span>下载图片</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedImage(null);
                          setShowSuccess(false);
                          setDownloadSuccess(false);
                        }}
                        className="flex-1 md:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                      >
                        🔄 继续生成
                      </button>
                      <Link
                        href="/my-images"
                        className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        📷 我的图片
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-gray-600 mb-2">
                        {selectedFile 
                          ? <>已选择图片：<span className="text-pink-500 font-medium">{selectedFile.name}</span></>
                          : '请上传图片开始生成'
                        }
                      </p>
                      <p className="text-sm text-gray-400">
                        当前风格：<span className="text-pink-500 font-medium">{getCurrentStyle()?.name || '自定义'}</span>
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        重置
                      </button>
                      <button
                        onClick={handleGenerate}
                        disabled={!selectedFile || isLoading}
                        className="px-8 py-2.5 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            <span>生成中...</span>
                          </>
                        ) : (
                          <>🚀 生成图片</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 错误提示 */}
              {error && (
                <div className="mt-4 bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <p className="font-medium">{error}</p>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2024 ArtFlow - 智能艺术图像生成</p>
        </footer>
      </main>

      {/* 登录弹窗 */}
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
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                Google 登录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIP弹窗 */}
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
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-purple-50 rounded-xl p-4 text-center border-2 border-purple-200">
                <p className="text-purple-600 font-bold">月卡</p>
                <p className="text-2xl font-bold text-purple-600">¥29</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl p-4 text-center border-2 border-yellow-300 text-white">
                <p className="font-bold">季卡</p>
                <p className="text-2xl font-bold">¥79</p>
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
                onClick={() => window.location.href = '/account/vip'}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold transition-all"
              >
                立即升级
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
