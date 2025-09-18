'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Sun, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/');
    } catch (error) {
      setError('Email hoặc mật khẩu không đúng');
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-cream via-vintage-beige to-primary-200 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-vintage-texture opacity-30"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-20 h-20 bg-accent-200 rounded-full opacity-20"></div>
      </div>
      <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-32 h-32 bg-primary-300 rounded-full opacity-15"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-vintage border border-primary-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-800 to-accent-700 px-8 py-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sun className="h-8 w-8 text-accent-200 animate-bounce-gentle" />
              <span className="font-display text-2xl font-bold text-white">
                lil.shunshine.thrift
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Chào mừng trở lại!</h1>
            <p className="text-primary-100">Đăng nhập để tiếp tục mua sắm</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-5 w-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-5 w-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all duration-300"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full bg-accent-500 hover:bg-accent-600 disabled:bg-accent-300 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-accent hover:shadow-lg hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-primary-200"></div>
              <span className="px-4 text-sm text-primary-500">hoặc</span>
              <div className="flex-1 border-t border-primary-200"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-primary-600">
                Chưa có tài khoản?{' '}
                <Link 
                  href="/auth/register" 
                  className="text-accent-600 hover:text-accent-700 font-semibold hover:underline transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-primary-500 hover:text-primary-700 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-6">
          <p className="text-primary-600 text-sm">
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <Link href="/terms" className="text-accent-600 hover:underline">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className="text-accent-600 hover:underline">
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
