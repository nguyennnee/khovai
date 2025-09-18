'use client';

import { CreditCard, Smartphone, Truck, Shield, CheckCircle, Clock, AlertTriangle, Star } from 'lucide-react';

export default function PaymentPolicyPage() {
  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CreditCard className="h-16 w-16 mx-auto mb-4 text-primary-200" />
          <h1 className="font-display text-4xl font-bold mb-4">
            Phương thức thanh toán
          </h1>
          <p className="text-xl text-primary-100">
            Đa dạng phương thức thanh toán an toàn, tiện lợi cho mọi khách hàng
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Payment Methods Overview */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h2 className="font-display text-2xl font-bold text-primary-900 mb-6">
            Các phương thức thanh toán
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
              <Truck className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-green-800 mb-2">COD</h3>
              <p className="text-sm text-green-600">Thanh toán khi nhận hàng</p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                Phổ biến nhất
              </span>
            </div>
            
            <div className="text-center p-6 bg-pink-50 rounded-xl border border-pink-200 hover:shadow-lg transition-shadow">
              <Smartphone className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="font-bold text-pink-800 mb-2">MoMo</h3>
              <p className="text-sm text-pink-600">Ví điện tử MoMo</p>
              <span className="inline-block mt-2 px-3 py-1 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">
                Nhanh chóng
              </span>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow">
              <CreditCard className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-blue-800 mb-2">VNPay</h3>
              <p className="text-sm text-blue-600">Thẻ ATM/Visa/Mastercard</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                Bảo mật cao
              </span>
            </div>
          </div>
        </div>

        {/* COD Payment */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="h-8 w-8 text-green-500" />
            <h3 className="font-display text-xl font-bold text-primary-900">
              Thanh toán khi nhận hàng (COD)
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary-800 mb-3">✅ Ưu điểm</h4>
                <ul className="space-y-2 text-primary-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Không cần thanh toán trước</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Kiểm tra hàng trước khi trả tiền</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>An toàn, không lo bị lừa đảo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Phù hợp mọi đối tượng khách hàng</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-primary-800 mb-3">📋 Lưu ý quan trọng</h4>
                <ul className="space-y-2 text-primary-600">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>Chuẩn bị đủ tiền mặt (đúng số tiền đơn hàng)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>Kiểm tra kỹ sản phẩm trước khi thanh toán</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>Phí COD: 20,000đ/đơn hàng</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>Từ chối nhận hàng sẽ bị blacklist</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">💡 Quy trình COD</h4>
              <ol className="text-sm text-green-700 space-y-1">
                <li>1. Shipper gọi điện xác nhận trước khi giao</li>
                <li>2. Khách hàng kiểm tra sản phẩm trong túi nilon</li>
                <li>3. Thanh toán tiền mặt cho shipper</li>
                <li>4. Nhận hàng và hóa đơn</li>
              </ol>
            </div>
          </div>
        </div>

        {/* MoMo Payment */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="h-8 w-8 text-pink-500" />
            <h3 className="font-display text-xl font-bold text-primary-900">
              Thanh toán qua MoMo
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-primary-800 mb-3">🚀 Ưu điểm</h4>
              <ul className="space-y-2 text-primary-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-pink-500" />
                  <span>Thanh toán nhanh chóng, tiện lợi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-pink-500" />
                  <span>Không cần phí COD</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-pink-500" />
                  <span>Xử lý đơn hàng ưu tiên</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-pink-500" />
                  <span>Tích điểm MoMo</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 bg-pink-50 rounded-xl border border-pink-200">
              <h4 className="font-semibold text-pink-800 mb-3">📱 Cách thanh toán</h4>
              <ol className="text-sm text-pink-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Chọn "Thanh toán MoMo" khi checkout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">2.</span>
                  <span>Quét mã QR hoặc chuyển khoản theo thông tin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Screenshot giao dịch thành công</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">4.</span>
                  <span>Gửi screenshot cho shop xác nhận</span>
                </li>
              </ol>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">⚡ Thông tin MoMo</h4>
            <div className="text-sm text-yellow-700">
              <p><strong>Số điện thoại:</strong> 0777746925</p>
              <p><strong>Tên tài khoản:</strong> NGUYEN DINH KIEN</p>
              <p className="mt-2 text-xs italic">* Vui lòng ghi rõ mã đơn hàng trong nội dung chuyển khoản</p>
            </div>
          </div>
        </div>

        {/* VNPay Payment */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-8 w-8 text-blue-500" />
            <h3 className="font-display text-xl font-bold text-primary-900">
              Thanh toán qua VNPay
            </h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary-800 mb-3">🔒 Bảo mật cao</h4>
                <ul className="space-y-2 text-primary-600">
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Mã hóa SSL 256-bit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Chuẩn bảo mật quốc tế PCI DSS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Không lưu trữ thông tin thẻ</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-primary-800 mb-3">💳 Loại thẻ hỗ trợ</h4>
                <ul className="space-y-2 text-primary-600">
                  <li>• Thẻ ATM nội địa (Việt Nam)</li>
                  <li>• Thẻ Visa/Mastercard</li>
                  <li>• Thẻ JCB</li>
                  <li>• Internet Banking</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">💡 Quy trình thanh toán</h4>
              <ol className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-semibold">1.</span>
                  <span>Chọn "Thanh toán VNPay" và loại thẻ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">2.</span>
                  <span>Chuyển đến trang VNPay để nhập thông tin thẻ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">3.</span>
                  <span>Xác thực OTP qua SMS</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold">4.</span>
                  <span>Hoàn tất thanh toán và nhận xác nhận</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Banking Information */}
        <div className="bg-white rounded-2xl shadow-vintage p-8 mb-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Thông tin chuyển khoản ngân hàng
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                MB Bank (Quân đội)
              </h4>
              <div className="space-y-2 text-green-700">
                <p><strong>Số tài khoản:</strong> 004556</p>
                <p><strong>Chủ tài khoản:</strong> NGUYEN DINH KIEN</p>
                <p><strong>Chi nhánh:</strong> MB Bank Cần Thơ</p>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Techcombank
              </h4>
              <div className="space-y-2 text-blue-700">
                <p><strong>Số tài khoản:</strong> 6666663214</p>
                <p><strong>Chủ tài khoản:</strong> NGUYEN DINH KIEN</p>
                <p><strong>Chi nhánh:</strong> Techcombank Cần Thơ</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">📝 Lưu ý chuyển khoản</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Ghi rõ mã đơn hàng trong nội dung chuyển khoản</li>
              <li>• Chuyển đúng số tiền (bao gồm phí ship nếu có)</li>
              <li>• Gửi screenshot giao dịch cho shop qua Facebook</li>
              <li>• Shop sẽ xác nhận và xử lý đơn hàng trong 30 phút</li>
            </ul>
          </div>
        </div>

        {/* Security & Guarantee */}
        <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-accent-200" />
            <h3 className="font-display text-xl font-bold">
              Cam kết bảo mật & An toàn
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-accent-100 mb-3">🔐 Bảo mật thông tin</h4>
              <ul className="space-y-2 text-accent-50 text-sm">
                <li>• Mã hóa dữ liệu SSL 256-bit</li>
                <li>• Không lưu trữ thông tin thẻ/tài khoản</li>
                <li>• Tuân thủ chuẩn bảo mật quốc tế</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-accent-100 mb-3">✅ Cam kết hoàn tiền</h4>
              <ul className="space-y-2 text-accent-50 text-sm">
                <li>• Hoàn tiền 100% nếu sản phẩm lỗi</li>
                <li>• Hoàn tiền nếu giao sai hàng</li>
                <li>• Hỗ trợ 24/7 cho mọi vấn đề thanh toán</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-vintage p-8">
          <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
            Câu hỏi thường gặp
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-xl">
              <h4 className="font-semibold text-primary-800 mb-2">❓ Có được thay đổi phương thức thanh toán sau khi đặt hàng?</h4>
              <p className="text-primary-600 text-sm">Có thể thay đổi trong vòng 30 phút sau khi đặt hàng. Liên hệ hotline để được hỗ trợ.</p>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-xl">
              <h4 className="font-semibold text-primary-800 mb-2">❓ Thanh toán online có an toàn không?</h4>
              <p className="text-primary-600 text-sm">Hoàn toàn an toàn. Chúng tôi sử dụng các cổng thanh toán uy tín như VNPay, MoMo với mã hóa cao cấp.</p>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-xl">
              <h4 className="font-semibold text-primary-800 mb-2">❓ Có thể thanh toán bằng tiền lẻ khi COD?</h4>
              <p className="text-primary-600 text-sm">Shipper sẽ có tiền lẻ để trả. Tuy nhiên, khuyến khích chuẩn bị đúng số tiền để thuận tiện.</p>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-xl">
              <h4 className="font-semibold text-primary-800 mb-2">❓ Bao lâu sau khi thanh toán online thì đơn hàng được xử lý?</h4>
              <p className="text-primary-600 text-sm">Đơn hàng được xử lý ngay sau khi nhận được xác nhận thanh toán thành công (thường trong 30 phút).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
