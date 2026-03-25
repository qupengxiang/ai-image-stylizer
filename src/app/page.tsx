'use client'

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const styles = [
  { 
    id: 'cute-cartoon', 
    name: '可爱卡通',
    example: 'https://picsum.photos/id/237/512/512',
    prompt: '可爱卡通风格，Q版，大眼睛，色彩鲜艳，圆润线条，萌系'
  },
  { 
    id: 'anime-manga', 
    name: '动漫漫画',
    example: 'https://picsum.photos/id/24/512/512',
    prompt: '动漫漫画风格，日本风格，大眼睛，清晰线条，色彩鲜明，二次元'
  },
  { 
    id: 'pixel-art', 
    name: '像素艺术',
    example: 'https://picsum.photos/id/20/512/512',
    prompt: '像素艺术风格，8位或16位游戏风格，块状像素，复古感，鲜艳色彩'
  },
  { 
    id: 'chibi', 
    name: 'Q版人物',
    example: 'https://picsum.photos/id/64/512/512',
    prompt: 'Q版人物风格，头大身体小，可爱，圆润，色彩鲜艳，萌系'
  },
  { 
    id: 'comic-book', 
    name: '漫画书',
    example: 'https://picsum.photos/id/91/512/512',
    prompt: '漫画书风格，美国漫画，大胆线条，鲜明色彩，夸张表情，对话框'
  },
  { 
    id: 'disney', 
    name: '迪士尼',
    example: 'https://picsum.photos/id/102/512/512',
    prompt: '迪士尼风格，经典动画，圆润造型，明亮色彩，童话感，温馨'
  },
  { 
    id: 'studio-ghibli', 
    name: '吉卜力',
    example: 'https://picsum.photos/id/106/512/512',
    prompt: '吉卜力工作室风格，手绘感，细腻色彩，自然场景，奇幻元素'
  },
  { 
    id: 'pop-art', 
    name: '波普艺术',
    example: 'https://picsum.photos/id/133/512/512',
    prompt: '波普艺术风格，鲜艳色彩，重复图案，流行文化元素，对比强烈'
  },
  { 
    id: 'cartoon-network', 
    name: '卡通网络',
    example: 'https://picsum.photos/id/169/512/512',
    prompt: '卡通网络风格，夸张造型，鲜明色彩，幽默元素，现代卡通'
  },
  { 
    id: 'stop-motion', 
    name: '定格动画',
    example: 'https://picsum.photos/id/177/512/512',
    prompt: '定格动画风格，黏土感，手工制作感，温暖色调，立体效果'
  },
  { 
    id: 'retro-cartoon', 
    name: '复古卡通',
    example: 'https://picsum.photos/id/180/512/512',
    prompt: '复古卡通风格，1950年代风格，简洁线条，柔和色彩，经典动画感'
  },
  { 
    id: 'digital-painting', 
    name: '数字绘画',
    example: 'https://picsum.photos/id/188/512/512',
    prompt: '数字绘画风格，CG感，细腻纹理，丰富色彩，现代艺术感'
  },
];

// 卡通风格的颜色和样式
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);

  // 登录后强制刷新 session
  useEffect(() => {
    setMounted(true);
    // 登录回调后会带有特定参数，检测到则刷新
    const params = new URLSearchParams(window.location.search);
    if (params.has('callback') || params.has('authenticated')) {
      window.location.reload();
    }
  }, []);

  // 当 session 状态变化时强制刷新
  useEffect(() => {
    if (status === "authenticated") {
      router.refresh();
    }
  }, [status, router]);
  const [selectedStyle, setSelectedStyle] = useState<string>('cute-cartoon');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 获取当前选中风格的提示词
  const getCurrentStylePrompt = () => {
    const style = styles.find(s => s.id === selectedStyle);
    return style?.prompt || '可爱卡通风格，Q版，大眼睛，色彩鲜艳，圆润线条，萌系';
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
    if (generatedImage) {
      setGeneratedImage(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('请先上传图片');
      return;
    }

    // 检查登录状态
    if (status !== 'authenticated') {
      setShowLoginModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 先调用 API 扣积分
      const deductRes = await fetch('/api/generation', { method: 'POST' })
      const deductData = await deductRes.json()
      
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
      
      console.log('积分已扣除:', deductData.cost, '剩余:', deductData.remainingCredits)
      
      // 获取当前选中风格的提示词
      const stylePrompt = getCurrentStylePrompt();
      
      // 模拟风格迁移过程
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 直接使用picsum.photos作为生成结果，确保图片能够正确加载
      // 为了确保每次生成的图片不同，使用随机种子
      const randomSeed = Math.floor(Math.random() * 1000);
      const generatedUrl = `https://picsum.photos/seed/${randomSeed}/512/512`;
      
      console.log('生成的图片URL:', generatedUrl);
      
      // 设置生成的图片URL
      setGeneratedImage(generatedUrl);
    } catch (err) {
      setError('生成图片时出错，请重试');
      console.error('生成图片错误:', err);
      
      // 出错时使用备用方案
      const randomSeed = Math.floor(Math.random() * 1000);
      const fallbackUrl = `https://picsum.photos/seed/${randomSeed}/512/512`;
      console.log('使用备用图片:', fallbackUrl);
      setGeneratedImage(fallbackUrl);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `imgart-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('下载失败:', err);
      // Fallback: open in new tab
      window.open(generatedImage, '_blank');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSelectedStyle('cute-cartoon');
    setGeneratedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-8 px-4 sm:px-6 lg:px-8 font-sans overflow-x-auto">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-block mb-6 p-4 bg-white rounded-full shadow-2xl border-4 border-yellow-300 transform rotate-3">
            <svg className="w-16 h-16 text-[#FF6B6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>

          {/* 右上角用户状态 */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {session && (
              <a
                href="/user-center"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-full text-sm font-medium transition-colors"
              >
                👤 用户中心
              </a>
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
                  onClick={() => signOut()}
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

          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight animate-bounce drop-shadow-lg">🎨 ImgArt 🎨</h1>
          <p className="text-white text-xl max-w-3xl mx-auto font-medium drop-shadow-md">
            上传图片，选择风格，一键生成超酷的艺术作品！图片不存储，仅用于生成过程。
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* 左边：风格选择 */}
          <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-4 border-pink-400 p-6 h-[650px] overflow-y-auto transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#FF6B6B] drop-shadow-sm">🎭 选择风格</h2>
            <div className="grid grid-cols-2 gap-4">
              {styles.map(style => (
                <div
                  key={style.id}
                  onClick={() => handleStyleChange(style.id)}
                  className={`rounded-xl overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-110 ${selectedStyle === style.id
                    ? 'ring-4 ring-[#FF6B6B] shadow-lg'
                    : 'hover:shadow-md border-2 border-gray-200'
                    }`}
                >
                  <div className="h-28 overflow-hidden bg-gray-100 border-b-2 border-gray-200">
                    <img
                      src={style.example}
                      alt={style.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-125"
                    />
                  </div>
                  <div className={`p-3 text-center ${selectedStyle === style.id
                    ? 'bg-[#FF6B6B] text-white'
                    : 'bg-white text-[#292F36] hover:bg-pink-50'
                    }`}>
                    <p className="font-bold text-sm">{style.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 中间：上传图片 */}
          <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-4 border-blue-400 p-5 h-[650px] flex flex-col transform hover:-translate-y-1">
            <h2 className="text-xl font-bold mb-4 text-center text-[#4ECDC4] drop-shadow-sm">📸 上传图片</h2>
            <div className="flex flex-col items-center flex-grow mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input-file mb-4 w-full"
              />
              {selectedFile ? (
                <div className="mt-2 w-full flex-grow">
                  <p className="text-sm text-[#4ECDC4] mb-2 text-center font-bold">预览：</p>
                  <div className="relative w-full h-[320px] bg-gray-100 rounded-xl overflow-hidden border-3 border-dashed border-[#4ECDC4]">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="预览"
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full flex-grow bg-gray-100 rounded-xl flex flex-col items-center justify-center border-3 border-dashed border-[#4ECDC4]">
                  <svg className="w-14 h-14 text-[#4ECDC4] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-[#292F36] font-bold">点击上方按钮上传图片</p>
                </div>
              )}
            </div>
            
            {/* 操作按钮 */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleGenerate}
                disabled={!selectedFile || isLoading}
                className="btn bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white flex items-center justify-center gap-2 py-2 text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 w-full transform hover:scale-105"
              >
                {isLoading && <div className="loading-spinner h-4 w-4"></div>}
                {isLoading ? '✨ 生成中...' : '🚀 生成图片'}
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

          {/* 右边：展示区域和提示词 */}
          <div className="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 border-4 border-yellow-400 p-6 h-[650px] flex flex-col transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#FFD166] drop-shadow-sm">🎊 生成结果</h2>
            
            {/* 提示词显示 */}
            <div className="mb-6 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border-2 border-pink-300">
              <h3 className="text-sm font-bold text-[#FF6B6B] mb-2">🎯 当前风格提示词：</h3>
              <p className="text-xs text-[#292F36] bg-white p-3 rounded-lg border border-gray-200">{getCurrentStylePrompt()}</p>
            </div>
            
            {/* 生成结果 */}
            {generatedImage ? (
              <div className="flex-grow flex flex-col">
                <div className="relative w-full h-[350px] bg-gray-100 rounded-xl overflow-hidden border-4 border-[#4ECDC4] mb-6">
                  {/* 显示生成的图片 */}
                  <img
                    src={generatedImage}
                    alt="生成结果"
                    className="w-full h-full object-contain p-6"
                    onError={(e) => {
                      // 图片加载失败时的处理
                      console.error('图片加载失败:', e);
                      // 使用备用图片
                      const fallbackUrl = `https://picsum.photos/seed/${Math.random()}/512/512`;
                      (e.target as HTMLImageElement).src = fallbackUrl;
                    }}
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="btn bg-gradient-to-r from-[#FFD166] to-[#FFBB33] text-[#292F36] flex items-center gap-2 px-6 py-2 text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    💾 下载图片
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-grow bg-gray-100 rounded-xl flex flex-col items-center justify-center border-4 border-dashed border-[#4ECDC4]">
                <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className="text-sm text-gray-500 text-center font-medium">
                  上传图片并选择风格后，点击生成按钮查看结果
                </p>
              </div>
            )}
            
            {/* 错误提示 */}
            {error && (
              <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-xl border-2 border-red-300">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="font-bold text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-10 text-center text-white">
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
                    window.location.href = '/user-center/membership';
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