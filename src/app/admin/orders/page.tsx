'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  MoreHorizontal,
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard
} from 'lucide-react';
import { ordersAPI } from '@/lib/services/api';
import { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    confirmed_orders: 0,
    shipped_orders: 0,
    delivered_orders: 0,
    total_revenue: 0
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, statsData] = await Promise.all([
        ordersAPI.getOrders({ limit: 100 }),
        ordersAPI.getOrderStats()
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().includes(searchQuery) ||
                         order.shipping_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.shipping_phone.includes(searchQuery);
    const matchesStatus = selectedStatus === 'Tất cả' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          icon: Clock, 
          text: 'Chờ xác nhận', 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-50 border-yellow-200' 
        };
      case 'confirmed':
        return { 
          icon: CheckCircle, 
          text: 'Đã xác nhận', 
          color: 'text-blue-600', 
          bg: 'bg-blue-50 border-blue-200' 
        };
      case 'processing':
        return { 
          icon: Package, 
          text: 'Đang xử lý', 
          color: 'text-purple-600', 
          bg: 'bg-purple-50 border-purple-200' 
        };
      case 'shipped':
        return { 
          icon: Truck, 
          text: 'Đang giao', 
          color: 'text-orange-600', 
          bg: 'bg-orange-50 border-orange-200' 
        };
      case 'delivered':
        return { 
          icon: CheckCircle, 
          text: 'Đã giao', 
          color: 'text-green-600', 
          bg: 'bg-green-50 border-green-200' 
        };
      case 'cancelled':
        return { 
          icon: XCircle, 
          text: 'Đã hủy', 
          color: 'text-red-600', 
          bg: 'bg-red-50 border-red-200' 
        };
      default:
        return { 
          icon: Clock, 
          text: 'Không xác định', 
          color: 'text-gray-600', 
          bg: 'bg-gray-50 border-gray-200' 
        };
    }
  };

  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case 'cod':
        return { text: 'COD', color: 'text-green-600' };
      case 'momo':
        return { text: 'MoMo', color: 'text-pink-600' };
      case 'vnpay':
        return { text: 'VNPay', color: 'text-blue-600' };
      case 'bank_transfer':
        return { text: 'Chuyển khoản', color: 'text-purple-600' };
      default:
        return { text: 'Không xác định', color: 'text-gray-600' };
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await ordersAPI.updateOrder(orderId, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
    }
  };

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) {
      alert('Vui lòng chọn ít nhất một đơn hàng');
      return;
    }

    try {
      switch (action) {
        case 'confirm':
          await Promise.all(selectedOrders.map(id => 
            ordersAPI.updateOrder(id, { status: 'confirmed' })
          ));
          setOrders(orders.map(o => 
            selectedOrders.includes(o.id) ? { ...o, status: 'confirmed' } : o
          ));
          setSelectedOrders([]);
          break;
        case 'ship':
          await Promise.all(selectedOrders.map(id => 
            ordersAPI.updateOrder(id, { status: 'shipped' })
          ));
          setOrders(orders.map(o => 
            selectedOrders.includes(o.id) ? { ...o, status: 'shipped' } : o
          ));
          setSelectedOrders([]);
          break;
        case 'deliver':
          await Promise.all(selectedOrders.map(id => 
            ordersAPI.updateOrder(id, { status: 'delivered' })
          ));
          setOrders(orders.map(o => 
            selectedOrders.includes(o.id) ? { ...o, status: 'delivered' } : o
          ));
          setSelectedOrders([]);
          break;
      }
    } catch (error) {
      console.error('Error in bulk action:', error);
      alert('Có lỗi xảy ra khi thực hiện hành động');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-900 mb-2">Quản lý đơn hàng</h1>
            <p className="text-primary-600">Theo dõi và xử lý đơn hàng</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">{stats.total_orders}</p>
            <p className="text-primary-600">Tổng đơn hàng</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">{stats.pending_orders}</p>
            <p className="text-primary-600">Chờ xác nhận</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">{stats.confirmed_orders}</p>
            <p className="text-primary-600">Đã xác nhận</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">{stats.shipped_orders}</p>
            <p className="text-primary-600">Đang giao</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">{stats.delivered_orders}</p>
            <p className="text-primary-600">Đã giao</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-accent-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">{formatPrice(stats.total_revenue)}</p>
            <p className="text-primary-600">Tổng doanh thu</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-vintage p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm mã đơn hàng, tên khách hàng, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipped">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="mt-4 p-4 bg-accent-50 rounded-xl border border-accent-200">
            <div className="flex items-center justify-between">
              <span className="text-accent-800 font-medium">
                Đã chọn {selectedOrders.length} đơn hàng
              </span>
              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-1 border border-accent-300 rounded-lg text-sm"
                  onChange={(e) => handleBulkAction(e.target.value)}
                >
                  <option>Chọn hành động</option>
                  <option value="confirm">Xác nhận đơn hàng</option>
                  <option value="ship">Đánh dấu đang giao</option>
                  <option value="deliver">Đánh dấu đã giao</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-vintage overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-primary-300 text-accent-500 focus:ring-accent-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Mã đơn hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-200">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const paymentInfo = getPaymentMethodInfo(order.payment_method);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={order.id} className="hover:bg-primary-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="rounded border-primary-300 text-accent-500 focus:ring-accent-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary-900">#{order.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-primary-900">{order.shipping_name}</p>
                        <p className="text-sm text-primary-600">{order.shipping_phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-primary-800">{order.items.length} sản phẩm</p>
                        <p className="text-sm text-primary-600">
                          {order.items.slice(0, 2).map(item => item.product_name).join(', ')}
                          {order.items.length > 2 && '...'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${paymentInfo.color}`}>
                        {paymentInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color} focus:outline-none focus:ring-2 focus:ring-accent-500`}
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-accent-600">{formatPrice(order.total_amount)}</p>
                        {order.shipping_fee > 0 && (
                          <p className="text-sm text-primary-500">+{formatPrice(order.shipping_fee)} ship</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-primary-600">
                        {new Date(order.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => showOrderDetails(order)}
                          className="p-2 text-primary-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-primary-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-primary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-800 mb-2">
              Không tìm thấy đơn hàng
            </h3>
            <p className="text-primary-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
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
                  Chi tiết đơn hàng #{selectedOrder.id}
                </h2>
                <button 
                  onClick={() => setShowOrderDetail(false)}
                  className="text-primary-600 hover:text-red-600 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary-50 rounded-xl p-4">
                  <h3 className="font-semibold text-primary-900 mb-3">Thông tin khách hàng</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary-500" />
                      <span>{selectedOrder.shipping_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary-500" />
                      <span>{selectedOrder.shipping_phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary-500" />
                      <span>{selectedOrder.shipping_address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 rounded-xl p-4">
                  <h3 className="font-semibold text-primary-900 mb-3">Thông tin đơn hàng</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary-500" />
                      <span>{getPaymentMethodInfo(selectedOrder.payment_method).text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary-500" />
                      <span>{formatDate(selectedOrder.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusInfo(selectedOrder.status).bg} ${getStatusInfo(selectedOrder.status).color}`}>
                        {getStatusInfo(selectedOrder.status).text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-primary-900 mb-3">Sản phẩm đã đặt</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl">
                      <div className="w-16 h-16 bg-primary-200 rounded-lg flex items-center justify-center">
                        {item.product_image ? (
                          <img 
                            src={`http://localhost:8000/uploads/${item.product_image}`}
                            alt={item.product_name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-primary-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-semibold text-primary-900">{item.product_name}</p>
                        <p className="text-sm text-primary-600">{item.product_brand} • {item.product_size}</p>
                        <p className="text-sm text-primary-500">{item.product_condition}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-accent-600">{formatPrice(item.price)}</p>
                        <p className="text-sm text-primary-600">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-accent-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-primary-700">Tạm tính:</span>
                  <span className="font-semibold">{formatPrice(selectedOrder.total_amount)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-primary-700">Phí vận chuyển:</span>
                  <span className="font-semibold">{formatPrice(selectedOrder.shipping_fee)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-accent-600 border-t border-accent-200 pt-2">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(selectedOrder.total_amount + selectedOrder.shipping_fee)}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Ghi chú</h3>
                  <p className="text-primary-700 bg-primary-50 rounded-xl p-4">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}