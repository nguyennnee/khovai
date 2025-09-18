'use client';

import { FileText, UserCheck, AlertTriangle, Shield, Scale, Gavel, Phone, Mail } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-primary-200" />
          <h1 className="font-display text-4xl font-bold mb-4">
            Điều khoản sử dụng
          </h1>
          <p className="text-xl text-primary-100">
            Quy định và điều khoản sử dụng dịch vụ tại lil.shunshine.thrift
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Last Updated */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-8">
          <p className="text-primary-800 font-medium">
            📅 Có hiệu lực từ: 11/09/2024 | Cập nhật lần cuối: 11/09/2024
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-4">
            1. Giới thiệu
          </h2>
          <p className="text-primary-700 leading-relaxed mb-4">
            Chào mừng bạn đến với <strong>lil.shunshine.thrift</strong> - nền tảng mua bán đồ local brand secondhand. 
            Bằng cách truy cập và sử dụng website, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây.
          </p>
          <p className="text-primary-700 leading-relaxed">
            Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>
        </div>

        {/* Definitions */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            2. Định nghĩa
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-xl">
              <h4 className="font-semibold text-primary-800 mb-2">"Chúng tôi" / "Shop"</h4>
              <p className="text-primary-600 text-sm">
                Lil.shunshine.thrift, được vận hành bởi Nguyễn Đình Kiên
              </p>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-xl">
              <h4 className="font-semibold text-primary-800 mb-2">"Bạn" / "Khách hàng"</h4>
              <p className="text-primary-600 text-sm">
                Cá nhân hoặc tổ chức sử dụng dịch vụ của chúng tôi
              </p>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-xl">
              <h4 className="font-semibold text-primary-800 mb-2">"Sản phẩm"</h4>
              <p className="text-primary-600 text-sm">
                Các mặt hàng thời trang local brand secondhand được bán trên nền tảng
              </p>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-xl">
              <h4 className="font-semibold text-primary-800 mb-2">"Dịch vụ"</h4>
              <p className="text-primary-600 text-sm">
                Nền tảng mua bán, giao hàng, thanh toán và các dịch vụ liên quan
              </p>
            </div>
          </div>
        </div>

        {/* User Obligations */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            3. Nghĩa vụ của người dùng
          </h3>
          
          <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <UserCheck className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Thông tin chính xác</h4>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Cung cấp thông tin cá nhân chính xác, đầy đủ</li>
                <li>• Cập nhật thông tin khi có thay đổi</li>
                <li>• Chịu trách nhiệm về tính xác thực của thông tin</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Bảo mật tài khoản</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Giữ bí mật thông tin đăng nhập</li>
                <li>• Thông báo ngay nếu phát hiện truy cập trái phép</li>
                <li>• Chịu trách nhiệm về mọi hoạt động từ tài khoản</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Scale className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Tuân thủ pháp luật</h4>
              </div>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                <li>• Tuân thủ các quy định về thương mại điện tử</li>
                <li>• Không vi phạm quyền sở hữu trí tuệ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            4. Các hành vi bị cấm
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Gian lận thanh toán</h4>
                <p className="text-red-600 text-sm">
                  Sử dụng thông tin thẻ/tài khoản không hợp lệ, chargeback gian lận
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Spam và lạm dụng</h4>
                <p className="text-red-600 text-sm">
                  Tạo nhiều tài khoản, spam tin nhắn, đánh giá giả
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Tấn công hệ thống</h4>
                <p className="text-red-600 text-sm">
                  Hack, virus, DDoS hoặc bất kỳ hành vi phá hoại nào
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Nội dung không phù hợp</h4>
                <p className="text-red-600 text-sm">
                  Đăng tải nội dung khiêu dâm, bạo lực, thù địch hoặc bất hợp pháp
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            5. Thông tin sản phẩm
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">📋 Cam kết của chúng tôi</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Mô tả sản phẩm chính xác nhất có thể</li>
                <li>• Hình ảnh thật 100%, không chỉnh sửa quá mức</li>
                <li>• Thông báo rõ ràng về tình trạng và khuyết điểm</li>
                <li>• Cam kết hàng chính hãng authentic</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">⚠️ Lưu ý quan trọng</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Sản phẩm secondhand có thể có dấu hiệu sử dụng nhẹ</li>
                <li>• Màu sắc có thể chênh lệch nhẹ do màn hình</li>
                <li>• Mỗi sản phẩm chỉ có 1 chiếc duy nhất</li>
                <li>• Giá đã bao gồm tất cả chi phí, không phát sinh thêm</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Orders and Payment */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            6. Đặt hàng và thanh toán
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-primary-800 mb-3">Quy trình đặt hàng</h4>
              <ol className="text-primary-700 space-y-2 text-sm">
                <li>1. Thêm sản phẩm vào giỏ hàng (được hold trong 10 phút)</li>
                <li>2. Điền thông tin giao hàng và chọn phương thức thanh toán</li>
                <li>3. Xác nhận đơn hàng và thanh toán</li>
                <li>4. Nhận email xác nhận và mã đơn hàng</li>
                <li>5. Theo dõi tình trạng đơn hàng qua website</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold text-primary-800 mb-3">Phương thức thanh toán</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                  <p className="font-medium text-green-800">COD</p>
                  <p className="text-xs text-green-600">Phí 20,000đ</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-lg border border-pink-200 text-center">
                  <p className="font-medium text-pink-800">MoMo</p>
                  <p className="text-xs text-pink-600">Miễn phí</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
                  <p className="font-medium text-blue-800">VNPay</p>
                  <p className="text-xs text-blue-600">Miễn phí</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            7. Quyền sở hữu trí tuệ
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-accent-50 rounded-xl border border-accent-200">
              <h4 className="font-semibold text-accent-800 mb-2">© Nội dung của chúng tôi</h4>
              <p className="text-accent-700 text-sm">
                Tất cả nội dung trên website (văn bản, hình ảnh, logo, thiết kế) thuộc quyền sở hữu của lil.shunshine.thrift. 
                Không được sao chép, phân phối mà không có sự cho phép.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">📝 Nội dung của bạn</h4>
              <p className="text-blue-700 text-sm">
                Khi đăng đánh giá, bình luận, bạn cấp cho chúng tôi quyền sử dụng nội dung đó cho mục đích vận hành dịch vụ.
              </p>
            </div>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            8. Giới hạn trách nhiệm
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">⚖️ Trách nhiệm của chúng tôi</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Đảm bảo sản phẩm đúng như mô tả</li>
                <li>• Giao hàng đúng thời gian cam kết</li>
                <li>• Bảo mật thông tin khách hàng</li>
                <li>• Hỗ trợ khách hàng trong giờ hành chính</li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">🚫 Chúng tôi không chịu trách nhiệm</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Thiệt hại gián tiếp hoặc hậu quả</li>
                <li>• Gián đoạn dịch vụ do bất khả kháng</li>
                <li>• Lỗi do người dùng sử dụng sai cách</li>
                <li>• Thiệt hại vượt quá giá trị đơn hàng</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dispute Resolution */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            9. Giải quyết tranh chấp
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Gavel className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Thương lượng trực tiếp</h4>
                <p className="text-primary-600 text-sm">
                  Mọi tranh chấp sẽ được giải quyết thông qua thương lượng trực tiếp giữa hai bên
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Tòa án có thẩm quyền</h4>
                <p className="text-primary-600 text-sm">
                  Nếu không thể thỏa thuận, tranh chấp sẽ được giải quyết tại Tòa án nhân dân TP. Cần Thơ
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-primary-800 mb-1">Pháp luật áp dụng</h4>
                <p className="text-primary-600 text-sm">
                  Điều khoản này được điều chỉnh bởi pháp luật Việt Nam
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            10. Chấm dứt dịch vụ
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">👤 Từ phía khách hàng</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Có thể hủy tài khoản bất kỳ lúc nào</li>
                <li>• Hoàn tất các đơn hàng đang xử lý</li>
                <li>• Thông báo trước nếu có tranh chấp</li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3">🏪 Từ phía shop</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Khóa tài khoản vi phạm điều khoản</li>
                <li>• Thông báo trước 7 ngày (trừ vi phạm nghiêm trọng)</li>
                <li>• Hoàn tiền đơn hàng chưa giao (nếu có)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            11. Cập nhật điều khoản
          </h3>
          
          <div className="space-y-4">
            <p className="text-primary-700">
              Chúng tôi có quyền cập nhật điều khoản này để phù hợp với pháp luật và hoạt động kinh doanh.
            </p>
            
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">📢 Thông báo thay đổi</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Thông báo qua email đăng ký</li>
                <li>• Hiển thị thông báo trên website</li>
                <li>• Thời gian có hiệu lực tối thiểu 15 ngày</li>
                <li>• Tiếp tục sử dụng = đồng ý với điều khoản mới</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 text-white">
          <h3 className="font-display text-xl font-bold mb-4">
            12. Thông tin liên hệ
          </h3>
          <p className="text-accent-100 mb-6">
            Có thắc mắc về điều khoản sử dụng? Liên hệ với chúng tôi:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent-200" />
                <div>
                  <p className="font-semibold">Hotline hỗ trợ</p>
                  <p className="text-accent-100 text-sm">0.7777.46925 | 0876.88.9992</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent-200" />
                <div>
                  <p className="font-semibold">Email hỗ trợ</p>
                  <p className="text-accent-100 text-sm">support@lil.shunshine.thrift</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-accent-300/30">
            <p className="text-accent-100 text-sm">
              <strong>Địa chỉ kinh doanh:</strong> Cần Thơ, Việt Nam<br />
              <strong>Người đại diện:</strong> Nguyễn Đình Kiên<br />
              <strong>Facebook:</strong> <a href="https://www.facebook.com/profile.php?id=61580137967371" className="text-accent-200 hover:text-white transition-colors">lil.shunshine.thrift</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
