'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Clock, 
  Truck, 
  CreditCard, 
  MapPin, 
  Phone, 
  User,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import { cartAPI, ordersAPI, Cart, CartItem, getImageUrl } from '@/lib/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    payment_method: 'cod',
    notes: ''
  });

  // Load cart data
  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  // Auto refresh cart every minute to update countdown
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      loadCart();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await cartAPI.getCart();
      setCart(cartData);
      
      // Trigger navbar refresh
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Helper function to validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    // Thrift shop logic: each product only has 1 item, quantity cannot be changed
    console.log('Thrift shop: quantity cannot be changed, each product has only 1 item');
    return;
  };

  const handleRemoveItem = async (itemId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      try {
        setUpdating(itemId);
        const updatedCart = await cartAPI.removeFromCart(itemId);
        setCart(updatedCart);
        showToast({
          type: 'success',
          title: 'Đã xóa khỏi giỏ hàng',
          message: 'Sản phẩm đã được xóa khỏi giỏ hàng của bạn.',
          duration: 3000
        });
      } catch (error) {
        console.error('Error removing cart item:', error);
        showToast({
          type: 'error',
          title: 'Lỗi xóa sản phẩm',
          message: 'Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.',
          duration: 4000
        });
      } finally {
        setUpdating(null);
      }
    }
  };

  const handleExtendHold = async () => {
    try {
      await cartAPI.extendCartHold();
      await loadCart();
      showToast({
        type: 'success',
        title: 'Gia hạn giỏ hàng thành công!',
        message: 'Giỏ hàng đã được gia hạn thêm 10 phút.',
        duration: 3000
      });
    } catch (error) {
      console.error('Error extending cart hold:', error);
      showToast({
        type: 'error',
        title: 'Lỗi gia hạn giỏ hàng',
        message: 'Có lỗi xảy ra khi gia hạn giỏ hàng. Vui lòng thử lại.',
        duration: 4000
      });
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      showToast({
        type: 'warning',
        title: 'Giỏ hàng trống',
        message: 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.',
        duration: 3000
      });
      return;
    }

    // Validate form
    if (!checkoutData.shipping_name || !checkoutData.shipping_phone || !checkoutData.shipping_address) {
      showToast({
        type: 'warning',
        title: 'Thiếu thông tin giao hàng',
        message: 'Vui lòng điền đầy đủ thông tin giao hàng.',
        duration: 3000
      });
      return;
    }

    try {
      setCheckoutLoading(true);
      
      // Prepare order items
      const orderItems = cart.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product_price
      }));

      // Create order
      const order = await ordersAPI.createOrder({
        shipping_name: checkoutData.shipping_name,
        shipping_phone: checkoutData.shipping_phone,
        shipping_address: checkoutData.shipping_address,
        payment_method: checkoutData.payment_method,
        notes: checkoutData.notes,
        items: orderItems
      });

      // Redirect to order success page
      router.push(`/orders/${order.id}?success=true`);
    } catch (error) {
      console.error('Error creating order:', error);
      showToast({
        type: 'error',
        title: 'Lỗi đặt hàng',
        message: 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.',
        duration: 4000
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-vintage-cream flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-900 mb-2">Vui lòng đăng nhập</h2>
          <p className="text-primary-600 mb-6">Bạn cần đăng nhập để xem giỏ hàng</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="btn-primary"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-vintage-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-vintage-cream">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-primary-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-primary-900 mb-4">Giỏ hàng trống</h1>
            <p className="text-primary-600 mb-8">Hãy thêm sản phẩm yêu thích vào giỏ hàng nhé!</p>
            <button 
              onClick={() => router.push('/products')}
              className="btn-primary"
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Giỏ hàng của bạn</h1>
          <p className="text-primary-600">
            {cart.total_items} sản phẩm • Tổng tiền: {formatPrice(cart.total_amount + cart.shipping_fee)}
          </p>
        </div>

        {/* Countdown Timer */}
        {cart.expires_in_minutes > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-800">
                    Giỏ hàng sẽ hết hạn sau: {formatTime(cart.expires_in_minutes)}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Hãy hoàn tất đơn hàng trước khi hết thời gian
                  </p>
                </div>
              </div>
              <button 
                onClick={handleExtendHold}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Gia hạn 10 phút
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-vintage p-6">
              <h2 className="text-xl font-bold text-primary-900 mb-6">Sản phẩm đã chọn</h2>
              
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-primary-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {item.product_image ? (() => {
                        const imageUrl = getImageUrl(item.product_image, 'products');
                        return imageUrl && isValidUrl(imageUrl) ? (
                          <Image
                            src={imageUrl}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-primary-400" />
                          </div>
                        );
                      })() : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-primary-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-900 mb-1">{item.product_name}</h3>
                      <p className="text-sm text-primary-600 mb-1">{item.product_brand} • {item.product_size}</p>
                      <p className="text-sm text-primary-500">{item.product_condition}</p>
                      <p className="font-bold text-accent-600 mt-2">{formatPrice(item.product_price)}</p>
                    </div>

                    {/* Quantity Display - Thrift shop only has 1 item per product */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-700">1</span>
                      </div>
                      <span className="text-xs text-primary-500">chiếc</span>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating === item.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-vintage p-6 sticky top-8">
              <h2 className="text-xl font-bold text-primary-900 mb-6">Tóm tắt đơn hàng</h2>
              
              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-primary-600">Tạm tính ({cart.total_items} sản phẩm):</span>
                  <span className="font-semibold">{formatPrice(cart.total_amount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-primary-600">Phí vận chuyển:</span>
                  <span className="font-semibold">
                    {cart.shipping_fee === 0 ? 'Miễn phí' : formatPrice(cart.shipping_fee)}
                  </span>
                </div>
                
                {cart.shipping_fee === 0 && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded-lg">
                    <CheckCircle className="h-4 w-4 inline mr-1" />
                    Miễn phí ship từ {formatPrice(cart.free_shipping_threshold)}
                  </div>
                )}
                
                <div className="border-t border-primary-200 pt-4">
                  <div className="flex justify-between text-lg font-bold text-accent-600">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(cart.total_amount + cart.shipping_fee)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setShowCheckoutForm(true)}
                disabled={checkoutLoading}
                className="w-full btn-primary"
              >
                {checkoutLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  'Tiến hành thanh toán'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Checkout Form Modal */}
        {showCheckoutForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-primary-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-primary-900">Thông tin giao hàng</h2>
                  <button 
                    onClick={() => setShowCheckoutForm(false)}
                    className="text-primary-600 hover:text-red-600 transition-colors"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Shipping Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      value={checkoutData.shipping_name}
                      onChange={(e) => setCheckoutData({...checkoutData, shipping_name: e.target.value})}
                      className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={checkoutData.shipping_phone}
                      onChange={(e) => setCheckoutData({...checkoutData, shipping_phone: e.target.value})}
                      className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Địa chỉ giao hàng *
                    </label>
                    <textarea
                      value={checkoutData.shipping_address}
                      onChange={(e) => setCheckoutData({...checkoutData, shipping_address: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Nhập địa chỉ giao hàng chi tiết"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-3">
                    Phương thức thanh toán
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'cod', label: 'COD (Thu hộ)', icon: Truck },
                      { value: 'momo', label: 'MoMo', icon: CreditCard },
                      { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: CreditCard }
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <label key={method.value} className="flex items-center gap-3 p-3 border border-primary-200 rounded-lg cursor-pointer hover:bg-primary-50">
                          <input
                            type="radio"
                            name="payment_method"
                            value={method.value}
                            checked={checkoutData.payment_method === method.value}
                            onChange={(e) => setCheckoutData({...checkoutData, payment_method: e.target.value})}
                            className="text-accent-500 focus:ring-accent-500"
                          />
                          <Icon className="h-5 w-5 text-primary-600" />
                          <span className="text-primary-800">{method.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={checkoutData.notes}
                    onChange={(e) => setCheckoutData({...checkoutData, notes: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                    placeholder="Ghi chú thêm cho đơn hàng..."
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-primary-50 rounded-xl p-4">
                  <h3 className="font-semibold text-primary-900 mb-3">Tóm tắt đơn hàng</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-primary-600">Tạm tính:</span>
                      <span>{formatPrice(cart.total_amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Phí vận chuyển:</span>
                      <span>{cart.shipping_fee === 0 ? 'Miễn phí' : formatPrice(cart.shipping_fee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-accent-600 border-t border-primary-200 pt-2">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(cart.total_amount + cart.shipping_fee)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCheckoutForm(false)}
                    className="flex-1 px-4 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="flex-1 btn-primary"
                  >
                    {checkoutLoading ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      'Đặt hàng'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}