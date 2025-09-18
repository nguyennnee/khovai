'use client';

import { Truck, MapPin, Clock, Package, CheckCircle, AlertTriangle, Phone } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Truck className="h-16 w-16 mx-auto mb-4 text-blue-200" />
          <h1 className="font-display text-4xl font-bold mb-4">
            Chính sách giao hàng
          </h1>
          <p className="text-xl text-blue-100">
            Giao hàng nhanh chóng, an toàn đến mọi miền đất nước
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Free Shipping Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white text-center mb-8">
          <Package className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">🎉 MIỄN PHÍ GIAO HÀNG TOÀN QUỐC</h2>
          <p className="text-green-100">Áp dụng cho tất cả đơn hàng từ lil.shunshine.thrift</p>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Khu vực giao hàng & Thời gian
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-800">📍 TP.HCM & Hà Nội</h4>
                <span className="text-green-600 font-bold">1-2 ngày</span>
              </div>
              <p className="text-sm text-green-600">Giao hàng nhanh trong ngày hoặc ngày hôm sau</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-800">📍 Các tỉnh thành khác</h4>
                <span className="text-blue-600 font-bold">2-4 ngày</span>
              </div>
              <p className="text-sm text-blue-600">Đà Nẵng, Cần Thơ, Hải Phòng và các tỉnh lân cận</p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-yellow-800">📍 Vùng sâu, vùng xa</h4>
                <span className="text-yellow-600 font-bold">3-7 ngày</span>
              </div>
              <p className="text-sm text-yellow-600">Các vùng miền núi, hải đảo và khu vực khó tiếp cận</p>
            </div>
          </div>
        </div>

        {/* Shipping Process */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Quy trình giao hàng
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Xác nhận đơn hàng</h4>
                <p className="text-primary-600 text-sm">
                  Shop xác nhận đơn hàng và thông tin giao hàng trong vòng 30 phút - 2 tiếng
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Đóng gói cẩn thận</h4>
                <p className="text-primary-600 text-sm">
                  Sản phẩm được đóng gói kỹ lưỡng với túi nilon chống nước và hộp carton bảo vệ
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Bàn giao vận chuyển</h4>
                <p className="text-primary-600 text-sm">
                  Đơn hàng được bàn giao cho đối tác vận chuyển (Giao Hàng Nhanh, J&T, Shopee Express...)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Theo dõi vận chuyển</h4>
                <p className="text-primary-600 text-sm">
                  Khách hàng nhận mã vận đơn để theo dõi hành trình giao hàng
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                5
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Giao hàng tận nơi</h4>
                <p className="text-primary-600 text-sm">
                  Shipper liên hệ trước 30 phút và giao hàng đúng địa chỉ
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Partners */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Đối tác vận chuyển
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="w-12 h-12 bg-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-red-800">Giao Hàng Nhanh</h4>
              <p className="text-xs text-red-600 mt-1">Ưu tiên khu vực TP.HCM</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-green-800">J&T Express</h4>
              <p className="text-xs text-green-600 mt-1">Mạng lưới toàn quốc</p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-orange-800">Shopee Express</h4>
              <p className="text-xs text-orange-600 mt-1">Giao hàng tiết kiệm</p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Lưu ý quan trọng
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Thông tin giao hàng chính xác</h4>
                <p className="text-primary-600 text-sm">
                  Vui lòng cung cấp đầy đủ và chính xác: Họ tên, số điện thoại, địa chỉ cụ thể
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Giờ giao hàng</h4>
                <p className="text-primary-600 text-sm">
                  Từ 8:00 - 21:00 hàng ngày (kể cả chủ nhật). Có thể giao buổi tối theo yêu cầu
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Kiểm tra hàng khi nhận</h4>
                <p className="text-primary-600 text-sm">
                  Vui lòng kiểm tra sản phẩm trước khi thanh toán. Từ chối nhận nếu phát hiện hư hỏng
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Liên hệ khi có vấn đề</h4>
                <p className="text-primary-600 text-sm">
                  Gọi ngay hotline 0.7777.46925 nếu có vấn đề về giao hàng
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Cases */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Trường hợp đặc biệt
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-3">⛈️ Thời tiết xấu</h4>
              <p className="text-sm text-yellow-700">
                Giao hàng có thể chậm trễ 1-2 ngày do mưa bão, ngập lụt. Shop sẽ thông báo trước.
              </p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3">🎊 Dịp lễ tết</h4>
              <p className="text-sm text-red-700">
                Thời gian giao hàng có thể kéo dài do nghỉ lễ. Đặt hàng sớm để đảm bảo nhận hàng đúng hạn.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">📱 Không liên lạc được</h4>
              <p className="text-sm text-blue-700">
                Nếu shipper không liên lạc được, hàng sẽ được gửi lại kho. Khách hàng cần liên hệ để sắp xếp giao lại.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-3">🏠 Địa chỉ sai/không tìm thấy</h4>
              <p className="text-sm text-purple-700">
                Phí giao lại: 30,000đ. Khuyến khích cung cấp địa chỉ chi tiết và số điện thoại chính xác.
              </p>
            </div>
          </div>
        </div>

        {/* Contact for Shipping */}
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 text-white">
          <h3 className="font-display text-xl font-bold mb-4">
            Cần hỗ trợ về giao hàng?
          </h3>
          <p className="text-accent-100 mb-6">
            Liên hệ ngay với chúng tôi để được hỗ trợ nhanh chóng
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="tel:0777746925"
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm p-4 rounded-xl hover:bg-white/30 transition-colors"
            >
              <Phone className="h-5 w-5 text-accent-200" />
              <div>
                <p className="font-semibold">Hotline giao hàng</p>
                <p className="text-accent-100 text-sm">0.7777.46925</p>
              </div>
            </a>
            
            <a 
              href="https://www.facebook.com/profile.php?id=61580137967371"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm p-4 rounded-xl hover:bg-white/30 transition-colors"
            >
              <MapPin className="h-5 w-5 text-accent-200" />
              <div>
                <p className="font-semibold">Theo dõi đơn hàng</p>
                <p className="text-accent-100 text-sm">Nhắn tin Facebook</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
