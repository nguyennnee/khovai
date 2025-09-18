'use client';

import { Shield, Award, CheckCircle, X, Clock, Star, Phone, AlertTriangle } from 'lucide-react';

export default function WarrantyPolicyPage() {
  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 mx-auto mb-4 text-green-200" />
          <h1 className="font-display text-4xl font-bold mb-4">
            Bảo hành sản phẩm
          </h1>
          <p className="text-xl text-green-100">
            Cam kết chất lượng và chế độ bảo hành uy tín cho mọi sản phẩm thrift
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Warranty Overview */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-6">
            Chế độ bảo hành tổng quan
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">Bảo hành chất lượng</h3>
              <p className="text-sm text-green-600">30 ngày đầu tiên</p>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
              <Award className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-800 mb-2">Cam kết authentic</h3>
              <p className="text-sm text-blue-600">100% hàng chính hãng</p>
            </div>
            
            <div className="text-center p-6 bg-accent-50 rounded-xl border border-accent-200">
              <Star className="h-8 w-8 text-accent-500 mx-auto mb-3" />
              <h3 className="font-semibold text-accent-800 mb-2">Hỗ trợ trọn đời</h3>
              <p className="text-sm text-accent-600">Tư vấn bảo quản</p>
            </div>
          </div>
        </div>

        {/* Warranty Coverage */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Những gì được bảo hành
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Lỗi mô tả sản phẩm</h4>
                <p className="text-primary-600 text-sm">
                  Tình trạng sản phẩm không đúng như mô tả (% new thấp hơn cam kết)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Lỗi chất lượng nghiêm trọng</h4>
                <p className="text-primary-600 text-sm">
                  Rách lớn, bung chỉ chính, phai màu bất thường không được thông báo trước
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Hàng giả/fake</h4>
                <p className="text-primary-600 text-sm">
                  Hoàn tiền 200% nếu phát hiện sản phẩm không chính hãng
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Lỗi ẩn</h4>
                <p className="text-primary-600 text-sm">
                  Lỗi không thể phát hiện khi mua nhưng xuất hiện sau vài lần sử dụng bình thường
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's NOT Covered */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Những gì KHÔNG được bảo hành
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Hư hỏng do sử dụng</h4>
                <p className="text-red-600 text-sm">
                  Rách do hoạt động mạnh, bám bẩn, phai màu do giặt sai cách
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Hao mòn tự nhiên</h4>
                <p className="text-red-600 text-sm">
                  Phai màu nhẹ do thời gian, co giãn do mặc thường xuyên
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Lỗi đã thông báo</h4>
                <p className="text-red-600 text-sm">
                  Những khuyết điểm đã được mô tả rõ trong bài đăng
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Quá thời hạn</h4>
                <p className="text-red-600 text-sm">
                  Sau 30 ngày kể từ ngày nhận hàng (trừ trường hợp hàng fake)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warranty Periods */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Thời hạn bảo hành theo loại sản phẩm
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-green-800">👕 Áo thun, hoodie, sweater</h4>
                <span className="text-green-600 font-bold">30 ngày</span>
              </div>
              <p className="text-sm text-green-600">
                Bảo hành chất lượng vải, đường may chính, in/thêu
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-blue-800">👖 Quần jean, cargo, shorts</h4>
                <span className="text-blue-600 font-bold">30 ngày</span>
              </div>
              <p className="text-sm text-blue-600">
                Bảo hành khóa kéo, nút cài, đường may quan trọng
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-800">🧥 Jacket, áo khoác</h4>
                <span className="text-purple-600 font-bold">30 ngày</span>
              </div>
              <p className="text-sm text-purple-600">
                Bảo hành khóa kéo chính, lót trong, cúc áo
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-yellow-800">👟 Giày, sneakers</h4>
                <span className="text-yellow-600 font-bold">15 ngày</span>
              </div>
              <p className="text-sm text-yellow-600">
                Bảo hành đế giày không bung, phần upper không rách lớn
              </p>
            </div>
            
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-red-800">🎒 Phụ kiện (túi, mũ, belt)</h4>
                <span className="text-red-600 font-bold">15 ngày</span>
              </div>
              <p className="text-sm text-red-600">
                Bảo hành khóa kéo, quai xách chính, khóa cài
              </p>
            </div>
          </div>
        </div>

        {/* Warranty Process */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Quy trình xử lý bảo hành
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Liên hệ báo lỗi</h4>
                <p className="text-primary-600 text-sm">
                  Gọi hotline hoặc nhắn tin Facebook, cung cấp mã đơn hàng và hình ảnh lỗi rõ ràng
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Thẩm định lỗi</h4>
                <p className="text-primary-600 text-sm">
                  Shop xem xét và xác định lỗi có thuộc diện bảo hành hay không trong 24h
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Đưa ra phương án</h4>
                <p className="text-primary-600 text-sm">
                  Hoàn tiền, đổi sản phẩm tương đương hoặc hỗ trợ sửa chữa (tùy trường hợp)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Xử lý bảo hành</h4>
                <p className="text-primary-600 text-sm">
                  Thực hiện phương án đã thỏa thuận trong vòng 2-3 ngày làm việc
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Hướng dẫn bảo quản để kéo dài tuổi thọ
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-primary-800 mb-3">🧺 Giặt ủi đúng cách</h4>
              <ul className="space-y-2 text-primary-600 text-sm">
                <li>• Giặt với nước lạnh hoặc ấm (≤ 30°C)</li>
                <li>• Phân loại màu sắc khi giặt</li>
                <li>• Sử dụng chế độ giặt nhẹ</li>
                <li>• Tránh chất tẩy mạnh</li>
                <li>• Ủi ở nhiệt độ thấp-trung bình</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary-800 mb-3">🗄️ Bảo quản đúng cách</h4>
              <ul className="space-y-2 text-primary-600 text-sm">
                <li>• Treo hoặc gấp gọn gàng</li>
                <li>• Tránh môi trường ẩm ướt</li>
                <li>• Không để dưới ánh sắng trực tiếp</li>
                <li>• Sử dụng túi chống ẩm</li>
                <li>• Kiểm tra định kỳ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Special Warranty */}
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 text-white mb-8">
          <h3 className="font-display text-xl font-bold mb-4">
            🌟 Chương trình bảo hành đặc biệt
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold text-accent-100 mb-2">💎 VIP Members</h4>
              <p className="text-accent-50 text-sm">
                Thành viên VIP được gia hạn bảo hành thêm 15 ngày cho tất cả sản phẩm
              </p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold text-accent-100 mb-2">🎁 Sản phẩm cao cấp</h4>
              <p className="text-accent-50 text-sm">
                Sản phẩm trên 1 triệu được bảo hành kéo dài 60 ngày
              </p>
            </div>
          </div>
        </div>

        {/* Contact for Warranty */}
        <div className="bg-white rounded-2xl shadow-vintage p-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Yêu cầu bảo hành ngay
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="tel:0777746925"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-colors"
            >
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">Hotline bảo hành</p>
                <p className="text-green-600 text-sm">0.7777.46925 (24/7)</p>
              </div>
            </a>
            
            <a 
              href="https://www.facebook.com/profile.php?id=61580137967371"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
            >
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-800">Báo lỗi qua Facebook</p>
                <p className="text-blue-600 text-sm">Gửi hình ảnh lỗi trực tiếp</p>
              </div>
            </a>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">📸 Khi liên hệ bảo hành, vui lòng cung cấp:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Mã đơn hàng</li>
              <li>• Hình ảnh rõ ràng vị trí lỗi</li>
              <li>• Mô tả chi tiết vấn đề</li>
              <li>• Thời gian phát hiện lỗi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
