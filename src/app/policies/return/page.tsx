'use client';

import { CheckCircle, Clock, X, AlertTriangle, Shield, ArrowRight, Phone, Mail } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-accent-200" />
          <h1 className="font-display text-4xl font-bold mb-4">
            Chính sách đổi trả
          </h1>
          <p className="text-xl text-accent-100">
            Cam kết bảo vệ quyền lợi khách hàng với chính sách đổi trả minh bạch và công bằng
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Summary */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-6">
            Tóm tắt chính sách
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800 mb-1">7 ngày đổi trả</h3>
              <p className="text-sm text-green-600">Kể từ ngày nhận hàng</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800 mb-1">100% hoàn tiền</h3>
              <p className="text-sm text-blue-600">Nếu sản phẩm lỗi</p>
            </div>
            
            <div className="text-center p-4 bg-accent-50 rounded-xl border border-accent-200">
              <ArrowRight className="h-8 w-8 text-accent-500 mx-auto mb-2" />
              <h3 className="font-semibold text-accent-800 mb-1">Đổi size miễn phí</h3>
              <p className="text-sm text-accent-600">Nếu còn hàng</p>
            </div>
          </div>
        </div>

        {/* Detailed Policy */}
        <div className="space-y-8">
          {/* Conditions for Return */}
          <div className="bg-white rounded-2xl shadow-vintage p-8">
            <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
              Điều kiện đổi trả
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Thời gian đổi trả</h4>
                  <p className="text-primary-600">Trong vòng 7 ngày kể từ ngày nhận hàng (không tính ngày lễ, Tết)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Tình trạng sản phẩm</h4>
                  <p className="text-primary-600">Sản phẩm còn nguyên tem mác, chưa qua sử dụng, không có mùi lạ (nước hoa, thuốc lá...)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Bao bì gốc</h4>
                  <p className="text-primary-600">Còn nguyên bao bì, túi gói hàng của lil.shunshine.thrift</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Hóa đơn mua hàng</h4>
                  <p className="text-primary-600">Có hóa đơn hoặc mã đơn hàng để xác minh giao dịch</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cases for Return */}
          <div className="bg-white rounded-2xl shadow-vintage p-8">
            <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
              Các trường hợp được đổi trả
            </h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold text-green-800">Sản phẩm bị lỗi</h4>
                </div>
                <ul className="text-sm text-green-700 space-y-1 ml-8">
                  <li>• Rách, thủng, bung chỉ do lỗi sản xuất</li>
                  <li>• Phai màu bất thường</li>
                  <li>• Không đúng mô tả về tình trạng sản phẩm</li>
                </ul>
                <p className="text-xs text-green-600 mt-2 italic">
                  → Hoàn tiền 100% hoặc đổi sản phẩm tương đương
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <ArrowRight className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold text-blue-800">Giao sai sản phẩm</h4>
                </div>
                <ul className="text-sm text-blue-700 space-y-1 ml-8">
                  <li>• Sai size, sai màu</li>
                  <li>• Sai sản phẩm so với đơn hàng</li>
                  <li>• Thiếu phụ kiện đi kèm</li>
                </ul>
                <p className="text-xs text-blue-600 mt-2 italic">
                  → Đổi sản phẩm đúng yêu cầu hoặc hoàn tiền
                </p>
              </div>
              
              <div className="p-4 bg-accent-50 rounded-xl border border-accent-200">
                <div className="flex items-center gap-3 mb-2">
                  <ArrowRight className="h-5 w-5 text-accent-500" />
                  <h4 className="font-semibold text-accent-800">Đổi size</h4>
                </div>
                <ul className="text-sm text-accent-700 space-y-1 ml-8">
                  <li>• Size không vừa (quá to hoặc quá nhỏ)</li>
                  <li>• Muốn đổi size khác (nếu còn hàng)</li>
                </ul>
                <p className="text-xs text-accent-600 mt-2 italic">
                  → Đổi size miễn phí (khách hàng chịu phí ship)
                </p>
              </div>
            </div>
          </div>

          {/* Cases NOT Eligible */}
          <div className="bg-white rounded-2xl shadow-vintage p-8">
            <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
              Các trường hợp KHÔNG được đổi trả
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Đã qua sử dụng</h4>
                  <p className="text-red-600 text-sm">Sản phẩm có dấu hiệu đã mặc, giặt hoặc có mùi lạ</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Quá thời hạn</h4>
                  <p className="text-red-600 text-sm">Sau 7 ngày kể từ ngày nhận hàng</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Sản phẩm đặc biệt</h4>
                  <p className="text-red-600 text-sm">Đồ lót, trang sức, phụ kiện cá nhân (trừ khi lỗi từ shop)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-1">Không còn bao bì</h4>
                  <p className="text-red-600 text-sm">Đã vứt bỏ túi đựng, tem mác gốc của shop</p>
                </div>
              </div>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-white rounded-2xl shadow-vintage p-8">
            <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
              Quy trình đổi trả
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Liên hệ với shop</h4>
                  <p className="text-primary-600 text-sm">
                    Gọi hotline hoặc nhắn tin Facebook trong vòng 7 ngày, cung cấp mã đơn hàng và mô tả vấn đề
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Xác nhận yêu cầu</h4>
                  <p className="text-primary-600 text-sm">
                    Shop xem xét và xác nhận yêu cầu đổi trả trong vòng 24h (ngày làm việc)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Gửi hàng trả</h4>
                  <p className="text-primary-600 text-sm">
                    Đóng gói sản phẩm cẩn thận và gửi về địa chỉ shop cung cấp (shop hỗ trợ phí ship nếu lỗi từ shop)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Kiểm tra & xử lý</h4>
                  <p className="text-primary-600 text-sm">
                    Shop kiểm tra sản phẩm và xử lý đổi trả trong vòng 2-3 ngày làm việc
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Hoàn tất</h4>
                  <p className="text-primary-600 text-sm">
                    Hoàn tiền hoặc gửi sản phẩm đổi mới cho khách hàng
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 text-white">
            <h3 className="font-display text-xl font-bold mb-4">
              Cần hỗ trợ đổi trả?
            </h3>
            <p className="text-accent-100 mb-6">
              Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="tel:0777746925"
                className="flex items-center gap-3 bg-white/20 backdrop-blur-sm p-4 rounded-xl hover:bg-white/30 transition-colors"
              >
                <Phone className="h-5 w-5 text-accent-200" />
                <div>
                  <p className="font-semibold">Hotline</p>
                  <p className="text-accent-100 text-sm">0.7777.46925</p>
                </div>
              </a>
              
              <a 
                href="https://www.facebook.com/profile.php?id=61580137967371"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/20 backdrop-blur-sm p-4 rounded-xl hover:bg-white/30 transition-colors"
              >
                <Mail className="h-5 w-5 text-accent-200" />
                <div>
                  <p className="font-semibold">Facebook</p>
                  <p className="text-accent-100 text-sm">Nhắn tin trực tiếp</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
