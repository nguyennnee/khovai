'use client';

import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle, Mail, Settings } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Lock className="h-16 w-16 mx-auto mb-4 text-blue-200" />
          <h1 className="font-display text-4xl font-bold mb-4">
            Chính sách bảo mật
          </h1>
          <p className="text-xl text-blue-100">
            Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của khách hàng
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Last Updated */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-blue-800 font-medium">
            📅 Cập nhật lần cuối: 11/09/2024 | Có hiệu lực từ: 11/09/2024
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-4">
            Giới thiệu
          </h2>
          <p className="text-primary-700 leading-relaxed mb-4">
            Tại <strong>lil.shunshine.thrift</strong>, chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. 
            Chính sách này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn.
          </p>
          <p className="text-primary-700 leading-relaxed">
            Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản trong chính sách bảo mật này.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Thông tin chúng tôi thu thập
          </h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Thông tin cá nhân</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Họ tên, email, số điện thoại</li>
                <li>• Địa chỉ giao hàng</li>
                <li>• Thông tin thanh toán (không lưu trữ chi tiết thẻ)</li>
                <li>• Ngày sinh, giới tính (nếu cung cấp)</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Thông tin sử dụng</h4>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Lịch sử duyệt web và mua hàng</li>
                <li>• Sản phẩm yêu thích, giỏ hàng</li>
                <li>• Thiết bị và trình duyệt sử dụng</li>
                <li>• Địa chỉ IP và vị trí địa lý</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Database className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Thông tin tương tác</h4>
              </div>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Tin nhắn, đánh giá, phản hồi</li>
                <li>• Tương tác trên social media</li>
                <li>• Lịch sử liên hệ với support</li>
                <li>• Cookies và dữ liệu phiên</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Cách chúng tôi sử dụng thông tin
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Cung cấp dịch vụ</h4>
                  <p className="text-primary-600 text-sm">
                    Xử lý đơn hàng, giao hàng, thanh toán và hỗ trợ khách hàng
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Cải thiện trải nghiệm</h4>
                  <p className="text-primary-600 text-sm">
                    Cá nhân hóa nội dung, gợi ý sản phẩm phù hợp
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Marketing</h4>
                  <p className="text-primary-600 text-sm">
                    Gửi thông báo khuyến mãi, hàng mới (có thể từ chối)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Phân tích dữ liệu</h4>
                  <p className="text-primary-600 text-sm">
                    Hiểu xu hướng mua sắm, cải thiện sản phẩm và dịch vụ
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Bảo mật</h4>
                  <p className="text-primary-600 text-sm">
                    Phát hiện gian lận, bảo vệ tài khoản khỏi truy cập trái phép
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <UserCheck className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-primary-800 mb-1">Tuân thủ pháp luật</h4>
                  <p className="text-primary-600 text-sm">
                    Đáp ứng yêu cầu pháp lý và quy định hiện hành
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Chia sẻ thông tin với bên thứ ba
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">✅ Những trường hợp chúng tôi chia sẻ thông tin:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Với đối tác vận chuyển (chỉ thông tin giao hàng cần thiết)</li>
                <li>• Với cổng thanh toán (VNPay, MoMo) để xử lý giao dịch</li>
                <li>• Với cơ quan pháp luật khi có yêu cầu hợp lệ</li>
                <li>• Với nhà cung cấp dịch vụ kỹ thuật (hosting, analytics)</li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">❌ Chúng tôi KHÔNG BAO GIỜ:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Bán thông tin cá nhân cho bên thứ ba</li>
                <li>• Chia sẻ thông tin để spam hoặc quảng cáo không mong muốn</li>
                <li>• Tiết lộ thông tin thanh toán chi tiết</li>
                <li>• Cho phép truy cập trái phép vào dữ liệu khách hàng</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Bảo mật dữ liệu
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Lock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-blue-800 mb-2">Mã hóa SSL</h4>
              <p className="text-sm text-blue-600">256-bit encryption cho mọi giao dịch</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <Database className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-green-800 mb-2">Lưu trữ an toàn</h4>
              <p className="text-sm text-green-600">Server bảo mật, backup định kỳ</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <Shield className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h4 className="font-semibold text-purple-800 mb-2">Kiểm soát truy cập</h4>
              <p className="text-sm text-purple-600">Chỉ nhân viên có thẩm quyền mới truy cập</p>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Quyền của bạn
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Quyền truy cập</h4>
                <p className="text-primary-600 text-sm">
                  Yêu cầu xem thông tin cá nhân mà chúng tôi đang lưu trữ về bạn
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Quyền chỉnh sửa</h4>
                <p className="text-primary-600 text-sm">
                  Cập nhật, sửa đổi thông tin cá nhân không chính xác
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Quyền xóa</h4>
                <p className="text-primary-600 text-sm">
                  Yêu cầu xóa tài khoản và dữ liệu cá nhân (trừ dữ liệu bắt buộc lưu theo pháp luật)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Quyền từ chối marketing</h4>
                <p className="text-primary-600 text-sm">
                  Hủy đăng ký nhận email marketing bất kỳ lúc nào
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cookies Policy */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Chính sách Cookies
          </h3>
          
          <div className="space-y-4">
            <p className="text-primary-700">
              Chúng tôi sử dụng cookies để cải thiện trải nghiệm người dùng và phân tích hiệu suất website.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">🍪 Cookies cần thiết</h4>
                <p className="text-sm text-blue-700">
                  Đảm bảo website hoạt động bình thường, lưu giỏ hàng, trạng thái đăng nhập
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">📊 Cookies phân tích</h4>
                <p className="text-sm text-green-700">
                  Google Analytics để hiểu cách người dùng tương tác với website
                </p>
              </div>
            </div>
            
            <p className="text-primary-600 text-sm">
              Bạn có thể tắt cookies trong cài đặt trình duyệt, nhưng một số tính năng có thể không hoạt động.
            </p>
          </div>
        </div>

        {/* Data Retention */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Thời gian lưu trữ dữ liệu
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
              <span className="text-primary-800 font-medium">Thông tin tài khoản</span>
              <span className="text-primary-600">Cho đến khi xóa tài khoản</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
              <span className="text-primary-800 font-medium">Lịch sử đơn hàng</span>
              <span className="text-primary-600">5 năm (theo quy định pháp luật)</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
              <span className="text-primary-800 font-medium">Dữ liệu analytics</span>
              <span className="text-primary-600">26 tháng</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
              <span className="text-primary-800 font-medium">Logs hệ thống</span>
              <span className="text-primary-600">12 tháng</span>
            </div>
          </div>
        </div>

        {/* Contact for Privacy */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8">
          <h3 className="font-display text-xl font-bold mb-4">
            Liên hệ về vấn đề bảo mật
          </h3>
          <p className="text-blue-100 mb-6">
            Có thắc mắc về chính sách bảo mật hoặc muốn thực hiện quyền của mình?
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="font-semibold">Email bảo mật</p>
                  <p className="text-blue-100 text-sm">privacy@lil.shunshine.thrift</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="font-semibold">Hotline bảo mật</p>
                  <p className="text-blue-100 text-sm">0.7777.46925</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-white rounded-2xl shadow-vintage p-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-4">
            Cập nhật chính sách
          </h3>
          <p className="text-primary-700 mb-4">
            Chúng tôi có thể cập nhật chính sách bảo mật này để phản ánh những thay đổi trong 
            hoạt động kinh doanh hoặc yêu cầu pháp lý.
          </p>
          <p className="text-primary-600 text-sm">
            Mọi thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trên website ít nhất 30 ngày trước khi có hiệu lực.
          </p>
        </div>
      </div>
    </div>
  );
}
