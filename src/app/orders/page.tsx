'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  X, 
  Eye, 
  Star,
  ArrowRight,
  Filter,
  Search,
  Calendar,
  CreditCard,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ordersAPI } from '@/lib/services/api';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: number;
  product_name: string;
  product_image?: string;
  product_price: number;
  product_brand: string;
  product_size: string;
  quantity: number;
}

interface Order {
  id: number;
  order_code?: string;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_fee: number;
  shipping_address: string;
  shipping_phone: string;
  shipping_name: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const ordersData = await ordersAPI.getOrders({ limit: 100 });
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.shipping_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'Tất cả' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          text: 'Chờ xác nhận', 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-50 border-yellow-200',
          icon: Clock
        };
      case 'confirmed':
        return { 
          text: 'Đã xác nhận', 
          color: 'text-blue-600', 
          bg: 'bg-blue-50 border-blue-200',
          icon: CheckCircle
        };
      case 'shipping':
        return { 
          text: 'Đang giao', 
          color: 'text-purple-600', 
          bg: 'bg-purple-50 border-purple-200',
          icon: Truck
        };
      case 'delivered':
        return { 
          text: 'Đã giao', 
          color: 'text-green-600', 
          bg: 'bg-green-50 border-green-200',
          icon: CheckCircle
        };
      case 'cancelled':
        return { 
          text: 'Đã hủy', 
          color: 'text-red-600', 
          bg: 'bg-red-50 border-red-200',
          icon: X
        };
      default:
        return { 
          text: 'Không xác định', 
          color: 'text-gray-600', 
          bg: 'bg-gray-50 border-gray-200',
          icon: Package
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const viewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-vintage-cream flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary-800 mb-2">
            Vui lòng đăng nhập
          </h2>
          <p className="text-primary-600 mb-6">
            Bạn cần đăng nhập để xem đơn hàng của mình
          </p>
          <Link 
            href="/auth/login"
            className="btn-primary"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vintage-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg border">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-white border-b border-primary-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-primary-900">
                Đơn hàng của tôi
              </h1>
              <p className="text-primary-600">
                Theo dõi và quản lý đơn hàng của bạn
              </p>
            </div>
            <div className="text-primary-600">
              {orders.length} đơn hàng
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-vintage p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-vintage overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-primary-900">
                            Đơn hàng #{order.order_code || order.id}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusInfo.text}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-primary-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(order.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            <span>{order.payment_method}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{order.shipping_address}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-900">
                          {formatPrice(order.total_amount + order.shipping_fee)}
                        </div>
                        <div className="text-sm text-primary-500">
                          {order.items.length} sản phẩm
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="space-y-3 mb-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                          <div className="w-12 h-12 bg-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            {item.product_image ? (
                              <Image
                                src={item.product_image}
                                alt={item.product_name}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-primary-400" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-primary-900 truncate">
                              {item.product_name}
                            </h4>
                            <p className="text-sm text-primary-500">
                              {item.product_brand} • Size {item.product_size} • SL: {item.quantity}
                            </p>
                          </div>
                          
                          <div className="text-sm font-medium text-primary-900">
                            {formatPrice(item.product_price * item.quantity)}
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <div className="text-center py-2">
                          <span className="text-sm text-primary-500">
                            Và {order.items.length - 3} sản phẩm khác...
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-primary-200">
                      <div className="flex items-center gap-2">
                        {order.status === 'delivered' && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors text-sm">
                            <Star className="h-4 w-4" />
                            Đánh giá
                          </button>
                        )}
                        
                        {order.status === 'shipping' && (
                          <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm">
                            <Truck className="h-4 w-4" />
                            Theo dõi
                          </button>
                        )}
                      </div>
                      
                      <button
                        onClick={() => viewOrderDetail(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-primary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-800 mb-2">
              {searchQuery || statusFilter !== 'Tất cả' ? 'Không tìm thấy đơn hàng' : 'Chưa có đơn hàng nào'}
            </h3>
            <p className="text-primary-600 mb-6">
              {searchQuery || statusFilter !== 'Tất cả' 
                ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                : 'Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn'
              }
            </p>
            {!searchQuery && statusFilter === 'Tất cả' && (
              <Link 
                href="/products"
                className="btn-primary"
              >
                Khám phá sản phẩm
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-primary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary-900">
                  Chi tiết đơn hàng #{selectedOrder.order_code || selectedOrder.id}
                </h2>
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="text-primary-600 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center gap-3">
                {(() => {
                  const statusInfo = getStatusInfo(selectedOrder.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${statusInfo.bg} ${statusInfo.color}`}>
                      <StatusIcon className="h-4 w-4" />
                      {statusInfo.text}
                    </span>
                  );
                })()}
                <span className="text-sm text-primary-500">
                  Đặt hàng lúc {formatDate(selectedOrder.created_at)}
                </span>
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-primary-900 mb-3">Thông tin giao hàng</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary-500" />
                      <span>{selectedOrder.shipping_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary-500" />
                      <span>{selectedOrder.shipping_phone}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary-500 mt-0.5" />
                      <span>{selectedOrder.shipping_address}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary-900 mb-3">Thông tin thanh toán</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary-500" />
                      <span>{selectedOrder.payment_method}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary-500" />
                      <span>Phí vận chuyển: {formatPrice(selectedOrder.shipping_fee)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-primary-900 mb-3">Sản phẩm đã đặt</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg">
                      <div className="w-16 h-16 bg-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            width={64}
                            height={64}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-primary-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-primary-900">
                          {item.product_name}
                        </h4>
                        <p className="text-sm text-primary-500">
                          {item.product_brand} • Size {item.product_size}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-primary-500">
                          SL: {item.quantity}
                        </div>
                        <div className="font-medium text-primary-900">
                          {formatPrice(item.product_price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-primary-200 pt-4">
                <div className="flex justify-between items-center text-lg font-bold text-primary-900">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(selectedOrder.total_amount + selectedOrder.shipping_fee)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Ghi chú</h3>
                  <p className="text-sm text-primary-600 bg-primary-50 p-3 rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}