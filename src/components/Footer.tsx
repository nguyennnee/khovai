'use client';

import Link from 'next/link';
import { Sun, Mail, Phone, MapPin, Instagram, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary-800 text-vintage-cream relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-vintage-texture opacity-10"></div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Cột 1: Logo + Slogan */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sun className="h-8 w-8 text-accent-200 animate-bounce-gentle" />
                <div className="flex flex-col">
                  <h2 className="font-display text-2xl font-bold text-accent-200 leading-tight">
                    lil.shunshine
                  </h2>
                  <span className="font-display text-lg font-semibold text-vintage-cream leading-tight -mt-1">
                    thrift
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-lg font-semibold text-accent-100">
                  "Săn đồ độc – Sống xanh – Phong cách riêng"
                </p>
                <p className="text-vintage-cream/80 leading-relaxed">
                  Chúng tôi mang đến những món đồ thrift và vintage độc đáo, 
                  giúp bạn tạo phong cách riêng biệt và góp phần bảo vệ môi trường.
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-accent-500/20 hover:bg-accent-500 rounded-full transition-all duration-300 hover:scale-110 group"
                >
                  <Instagram className="h-5 w-5 text-accent-200 group-hover:text-white" />
                </a>
                <a 
                  href="https://tiktok.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-accent-500/20 hover:bg-accent-500 rounded-full transition-all duration-300 hover:scale-110 group"
                >
                  <div className="h-5 w-5 bg-accent-200 group-hover:bg-white rounded-sm"></div>
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61580137967371" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-accent-500/20 hover:bg-accent-500 rounded-full transition-all duration-300 hover:scale-110 group"
                >
                  <div className="h-5 w-5 bg-accent-200 group-hover:bg-white rounded-sm"></div>
                </a>
              </div>
            </div>

            {/* Cột 2: Thông tin liên hệ */}
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-accent-200">
                Liên hệ
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-accent-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-vintage-cream font-medium">Facebook</p>
                    <a 
                      href="https://www.facebook.com/profile.php?id=61580137967371" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-vintage-cream/80 hover:text-accent-200 transition-colors"
                    >
                      lil.shunshine.thrift
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-accent-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-vintage-cream font-medium">Hotline</p>
                    <div className="space-y-1">
                      <a 
                        href="tel:0777746925" 
                        className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                      >
                        0.7777.46925
                      </a>
                      <a 
                        href="tel:0876889992" 
                        className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                      >
                        0876.88.9992
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-accent-200 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-vintage-cream font-medium">Địa chỉ</p>
                    <p className="text-vintage-cream/80">
                      Cần Thơ, Việt Nam<br />
                      (Giao hàng toàn quốc)
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-vintage-cream/20">
                  <p className="text-vintage-cream font-medium">Giờ hoạt động</p>
                  <p className="text-vintage-cream/80">
                    Thứ 2 - Chủ nhật: 9:00 - 22:00
                  </p>
                </div>
              </div>
            </div>

            {/* Cột 3: Quick Links */}
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-accent-200">
                Khám phá
              </h3>
              
              <div className="space-y-3">
                <Link 
                  href="/products" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors font-medium"
                >
                  Tất cả sản phẩm
                </Link>
                <Link 
                  href="/categories/vintage" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Vintage Collection
                </Link>
                <Link 
                  href="/categories/y2k" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Y2K Fashion
                </Link>
                <Link 
                  href="/categories/streetwear" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Streetwear
                </Link>
                <Link 
                  href="/blog" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Blog & Lookbook
                </Link>
                <Link 
                  href="/about" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Về chúng tôi
                </Link>
              </div>
            </div>

            {/* Cột 4: Chính sách */}
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-accent-200">
                Chính sách
              </h3>
              
              <div className="space-y-3">
                <Link 
                  href="/policies/return" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Chính sách đổi trả
                </Link>
                <Link 
                  href="/policies/payment" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Phương thức thanh toán
                </Link>
                <Link 
                  href="/policies/shipping" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Chính sách giao hàng
                </Link>
                <Link 
                  href="/policies/warranty" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Bảo hành sản phẩm
                </Link>
                <Link 
                  href="/policies/privacy" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Chính sách bảo mật
                </Link>
                <Link 
                  href="/policies/terms" 
                  className="block text-vintage-cream/80 hover:text-accent-200 transition-colors"
                >
                  Điều khoản sử dụng
                </Link>
              </div>

              {/* Newsletter Signup */}
              <div className="pt-4 border-t border-vintage-cream/20">
                <h4 className="text-vintage-cream font-semibold mb-3">
                  Đăng ký nhận tin
                </h4>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Email của bạn" 
                    className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-vintage-cream/30 text-vintage-cream placeholder-vintage-cream/50 focus:outline-none focus:ring-2 focus:ring-accent-200 focus:border-transparent text-sm"
                  />
                  <button className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors text-sm font-medium">
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-vintage-cream/20 bg-primary-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-vintage-cream/80">
                <span>© 2024 lil.shunshine.thrift</span>
                <Heart className="h-4 w-4 text-accent-200" />
                <span>Made with love in Vietnam</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <Link 
                  href="/sitemap" 
                  className="text-vintage-cream/60 hover:text-accent-200 transition-colors"
                >
                  Sitemap
                </Link>
                <Link 
                  href="/faq" 
                  className="text-vintage-cream/60 hover:text-accent-200 transition-colors"
                >
                  FAQ
                </Link>
                <Link 
                  href="/contact" 
                  className="text-vintage-cream/60 hover:text-accent-200 transition-colors"
                >
                  Liên hệ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}