'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sun, Heart, Star, Award, Users, Phone, CreditCard, ArrowRight, CheckCircle, ShoppingBag, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-vintage-cream via-vintage-beige to-accent-100 py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-vintage-texture opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-accent-200 rounded-full opacity-30"></div>
        </div>
        <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-32 h-32 bg-primary-300 rounded-full opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full mb-8 shadow-vintage">
            <Sun className="h-6 w-6 text-accent-500 animate-bounce-gentle" />
            <span className="font-semibold text-primary-800">Câu chuyện của chúng tôi</span>
          </div>
          
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-primary-900 mb-6 leading-tight">
            🌞 GIỚI THIỆU<br />
            <span className="text-accent-500">LIL.SHUNSHINE.THRIFT</span> 🌞
          </h1>
          
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            Nơi những món đồ local brand được tái sinh và tỏa sáng với giá cả yêu thương 💛
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Founder Introduction */}
          <div className="bg-white rounded-3xl shadow-vintage p-8 lg:p-12 mb-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Avatar Placeholder */}
              <div className="w-48 h-48 bg-gradient-to-br from-accent-200 to-accent-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-vintage">
                <div className="text-center text-white">
                  <Sun className="h-16 w-16 mx-auto mb-2" />
                  <p className="font-bold text-lg">Kiên</p>
                  <p className="text-sm opacity-90">Founder</p>
                </div>
              </div>
              
              {/* Introduction Text */}
              <div className="flex-1 space-y-4">
                <h2 className="font-display text-2xl font-bold text-primary-900">
                  Xin chào mọi người,
                </h2>
                <p className="text-primary-700 leading-relaxed text-lg">
                  Mình là <span className="font-bold text-accent-600">Nguyễn Đình Kiên</span> – founder của Lil.shunshine.thrift.
                </p>
              </div>
            </div>
          </div>

          {/* Why We Started */}
          <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-3xl p-8 lg:p-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-8 w-8 text-accent-500" />
              <h2 className="font-display text-3xl font-bold text-accent-700">Lý do thành lập:</h2>
            </div>
            
            <div className="space-y-6 text-primary-800 leading-relaxed">
              <p>
                Từ lâu mình đã là một người mê local brand Việt Nam, đặc biệt là các thương hiệu đình đám trong giới trẻ như 
                <span className="font-bold text-accent-600"> AASTU, Stressmama, Whenever</span>. 
                Những chiếc áo, hoodie hay phụ kiện local không chỉ là quần áo, mà còn mang theo cá tính, 
                phong cách và dấu ấn của cả một thế hệ.
              </p>
              
              <p>
                Tuy nhiên, mình nhận thấy có rất nhiều bạn trẻ yêu thích local brand nhưng lại e ngại về giá cả, 
                hoặc khó khăn trong việc săn những món hot trend đã sold out.
              </p>
              
              <div className="bg-white/80 rounded-2xl p-6 shadow-vintage">
                <p className="font-semibold text-accent-700 mb-3">
                  Vậy nên mình quyết định mở Lil.shunshine.thrift – một nơi:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Thu mua – ký gửi – bán lại đồ local brand secondhand</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Cam kết <strong>100% hàng chính hãng</strong></span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>Giúp những item cũ có cơ hội tỏa sáng lần nữa, đồng thời mang đến lựa chọn hợp túi tiền cho anh em yêu local brand</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="bg-white rounded-3xl shadow-vintage p-8 lg:p-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-8 w-8 text-accent-500" />
              <h2 className="font-display text-3xl font-bold text-primary-900">Sứ mệnh & Tầm nhìn:</h2>
            </div>
            
            <p className="text-primary-700 leading-relaxed text-lg">
              Lil.shunshine.thrift không chỉ đơn thuần là shop bán đồ secondhand, mà mình muốn xây dựng thành 
              <span className="font-bold text-accent-600"> một cộng đồng yêu local brand</span> – 
              nơi mọi người có thể trao đổi, mua bán, chia sẻ outfit, và cùng nhau lan tỏa giá trị bền vững của thời trang.
            </p>
          </div>

          {/* Policies */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8 lg:p-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Award className="h-8 w-8 text-primary-600" />
              <h2 className="font-display text-3xl font-bold text-primary-800">Chính sách:</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-primary-700 font-medium">Nhận COD toàn quốc</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-primary-700 font-medium">Thanh toán linh hoạt, hỗ trợ bank full</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-primary-700 font-medium">Sẵn sàng đổi trả nếu phát hiện hàng không đúng cam kết</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-primary-700 font-medium">Miễn phí vận chuyển toàn quốc</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-3xl shadow-vintage p-8 lg:p-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Phone className="h-8 w-8 text-accent-500" />
              <h2 className="font-display text-3xl font-bold text-primary-900">Thông tin liên hệ:</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">📞 Hotline:</h3>
                  <div className="space-y-1">
                    <a href="tel:0777746925" className="block text-accent-600 hover:text-accent-700 font-medium text-lg transition-colors">
                      0.7777.46925
                    </a>
                    <a href="tel:0876889992" className="block text-accent-600 hover:text-accent-700 font-medium text-lg transition-colors">
                      0876.88.9992
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">🏦 Thông tin banking:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-primary-600" />
                      <span className="text-primary-700">MB Bank: <strong>004556</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-primary-600" />
                      <span className="text-primary-700">Techcombank: <strong>6666663214</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media CTA */}
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl p-8 lg:p-12 text-center text-white">
            <h2 className="font-display text-3xl font-bold mb-4">
              👉 Follow page để cùng mình săn lùng những món local brand hot nhất với giá cực yêu nha!
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <a 
                href="https://www.facebook.com/profile.php?id=61580137967371" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-white/20 hover:bg-white/30 backdrop-blur-sm px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">f</span>
                  </div>
                  <span className="font-semibold">Follow Facebook Page</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
              
              <Link 
                href="/products" 
                className="group bg-white text-accent-600 hover:bg-vintage-cream px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Bắt đầu mua sắm</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

          {/* Community Values */}
          <div className="mt-20">
            <h2 className="font-display text-3xl font-bold text-center text-primary-900 mb-12">
              Giá trị cộng đồng 🌟
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-2xl shadow-vintage hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-accent-500" />
                </div>
                <h3 className="font-bold text-primary-800 mb-2">Yêu local brand</h3>
                <p className="text-primary-600 text-sm">Ủng hộ và lan tỏa những thương hiệu Việt chất lượng</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-vintage hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-accent-500" />
                </div>
                <h3 className="font-bold text-primary-800 mb-2">Cộng đồng gắn kết</h3>
                <p className="text-primary-600 text-sm">Tạo không gian trao đổi và chia sẻ đam mê thời trang</p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-vintage hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sun className="h-8 w-8 text-accent-500" />
                </div>
                <h3 className="font-bold text-primary-800 mb-2">Bền vững & Xanh</h3>
                <p className="text-primary-600 text-sm">Thời trang tái chế, góp phần bảo vệ môi trường</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
