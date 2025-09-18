'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { notificationsAPI } from '@/lib/services/api';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setStatus('idle');

    try {
      await notificationsAPI.subscribeToNotifications(email, ['vintage', 'y2k', 'streetwear']);
      setStatus('success');
      setMessage('Đăng ký thành công! Bạn sẽ nhận được thông báo khi có hàng mới.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('Có lỗi xảy ra. Vui lòng thử lại sau.');
      console.error('Newsletter subscription failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-800 via-primary-900 to-accent-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-vintage-texture opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-accent-500/20 rounded-full animate-float"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-accent-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
          <Mail className="h-5 w-5 text-accent-300" />
          <span className="text-sm font-medium text-accent-200">Exclusive Updates</span>
        </div>
        
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Đừng bỏ lỡ hàng mới! ✨
        </h2>
        
        <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          Đăng ký nhận thông báo khi có sản phẩm vintage và thrift độc đáo mới 
          phù hợp với phong cách của bạn
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full px-6 py-4 rounded-full text-primary-900 bg-white/95 backdrop-blur-sm placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:bg-white transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading || !email.trim()}
              className="bg-accent-500 hover:bg-accent-600 disabled:bg-accent-500/50 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 whitespace-nowrap hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-accent hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang đăng ký...
                </div>
              ) : (
                'Đăng ký ngay'
              )}
            </button>
          </div>
        </form>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="flex items-center justify-center gap-2 bg-green-500/20 backdrop-blur-sm text-green-200 px-6 py-3 rounded-full max-w-md mx-auto animate-slide-up">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center justify-center gap-2 bg-red-500/20 backdrop-blur-sm text-red-200 px-6 py-3 rounded-full max-w-md mx-auto animate-slide-up">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-accent-300" />
            </div>
            <h3 className="font-semibold text-white mb-1">Thông báo sớm</h3>
            <p className="text-sm text-primary-300">Được biết trước khi có hàng mới về</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-accent-300" />
            </div>
            <h3 className="font-semibold text-white mb-1">Ưu đãi độc quyền</h3>
            <p className="text-sm text-primary-300">Giảm giá chỉ dành cho subscriber</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="h-6 w-6 text-accent-300" />
            </div>
            <h3 className="font-semibold text-white mb-1">Không spam</h3>
            <p className="text-sm text-primary-300">Chỉ thông báo khi thực sự cần thiết</p>
          </div>
        </div>
      </div>
    </section>
  );
}
