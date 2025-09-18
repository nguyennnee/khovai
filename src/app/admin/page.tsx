'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Eye,
  Plus,
  Crown,
  Sun,
  Calendar,
  Clock,
  ArrowRight,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import QuickAddProduct from '@/components/QuickAddProduct';

// Sample data - trong thực tế sẽ fetch từ API
const dashboardStats = {
  totalProducts: 156,
  totalOrders: 89,
  totalUsers: 234,
  totalRevenue: 45600000,
  monthlyGrowth: {
    products: 12.5,
    orders: 8.3,
    users: 15.7,
    revenue: 23.4
  }
};

const recentOrders = [
  {
    id: 'LT240911001',
    customer: 'Nguyễn Văn A',
    products: 2,
    total: 450000,
    status: 'confirmed',
    time: '2 phút trước'
  },
  {
    id: 'LT240911002', 
    customer: 'Trần Thị B',
    products: 1,
    total: 320000,
    status: 'shipping',
    time: '15 phút trước'
  },
  {
    id: 'LT240911003',
    customer: 'Lê Văn C', 
    products: 3,
    total: 680000,
    status: 'pending',
    time: '1 giờ trước'
  }
];

const topProducts = [
  {
    id: 1,
    name: 'AASTU Basic Hoodie',
    brand: 'AASTU',
    sold: 45,
    revenue: 13500000,
    image: '/api/placeholder/60/60'
  },
  {
    id: 2,
    name: 'Stressmama Vintage Tee',
    brand: 'Stressmama', 
    sold: 38,
    revenue: 9120000,
    image: '/api/placeholder/60/60'
  },
  {
    id: 3,
    name: 'Whenever Oversized Jacket',
    brand: 'Whenever',
    sold: 23,
    revenue: 11040000,
    image: '/api/placeholder/60/60'
  }
];

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check admin permission
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-vintage-cream flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-vintage max-w-md">
          <Crown className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-900 mb-4">Không có quyền truy cập</h1>
          <p className="text-primary-600 mb-6">Bạn cần quyền Admin để truy cập trang này</p>
          <Link href="/" className="btn-primary">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipping':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao';
      case 'pending':
        return 'Chờ xác nhận';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Crown className="h-8 w-8 text-accent-200" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
                <p className="text-accent-100">Chào mừng {user?.full_name} 👋</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 text-accent-100 mb-1">
                <Calendar className="h-4 w-4" />
                <span>{currentTime.toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-2 text-accent-200">
                <Clock className="h-4 w-4" />
                <span>{currentTime.toLocaleTimeString('vi-VN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-vintage p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ChevronUp className="h-4 w-4" />
                <span className="text-sm font-medium">+{dashboardStats.monthlyGrowth.products}%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">{dashboardStats.totalProducts}</p>
              <p className="text-primary-600">Tổng sản phẩm</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-vintage p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ChevronUp className="h-4 w-4" />
                <span className="text-sm font-medium">+{dashboardStats.monthlyGrowth.orders}%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">{dashboardStats.totalOrders}</p>
              <p className="text-primary-600">Đơn hàng</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-vintage p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ChevronUp className="h-4 w-4" />
                <span className="text-sm font-medium">+{dashboardStats.monthlyGrowth.users}%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">{dashboardStats.totalUsers}</p>
              <p className="text-primary-600">Người dùng</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-vintage p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-accent-600" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ChevronUp className="h-4 w-4" />
                <span className="text-sm font-medium">+{dashboardStats.monthlyGrowth.revenue}%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-900">{formatPrice(dashboardStats.totalRevenue)}</p>
              <p className="text-primary-600">Doanh thu</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-vintage p-6 mb-8">
          <h2 className="text-xl font-bold text-primary-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 group">
              <QuickAddProduct 
                onProductAdded={() => window.location.reload()}
                className="w-full h-full flex flex-col items-center gap-3 p-0 bg-transparent hover:bg-transparent"
                buttonText=""
                buttonIcon={
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                }
              />
              <span className="font-medium text-blue-800">Thêm sản phẩm</span>
            </div>

            <Link 
              href="/admin/orders"
              className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <span className="font-medium text-purple-800">Quản lý đơn hàng</span>
            </Link>

            <Link 
              href="/admin/users"
              className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="font-medium text-green-800">Quản lý user</span>
            </Link>

            <Link 
              href="/admin/analytics"
              className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl hover:from-accent-100 hover:to-accent-200 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="font-medium text-accent-800">Thống kê</span>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-vintage p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-900">Đơn hàng gần đây</h2>
              <Link 
                href="/admin/orders"
                className="text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-1 transition-colors"
              >
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-primary-900">#{order.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-primary-700">{order.customer}</p>
                    <p className="text-sm text-primary-500">{order.products} sản phẩm • {order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent-600">{formatPrice(order.total)}</p>
                    <button className="text-primary-600 hover:text-accent-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-vintage p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary-900">Sản phẩm bán chạy</h2>
              <Link 
                href="/admin/products"
                className="text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-1 transition-colors"
              >
                Xem tất cả
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                  <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="w-12 h-12 bg-primary-200 rounded-lg overflow-hidden flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-primary-900">{product.name}</p>
                    <p className="text-sm text-primary-600">{product.brand}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-accent-600">{formatPrice(product.revenue)}</p>
                    <p className="text-sm text-primary-500">{product.sold} đã bán</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="mt-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <Sun className="h-8 w-8 text-accent-300" />
            <h2 className="text-2xl font-bold">Tóm tắt hôm nay</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-300 mb-1">12</p>
              <p className="text-primary-200">Đơn hàng mới</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-300 mb-1">8</p>
              <p className="text-primary-200">Sản phẩm bán</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-300 mb-1">5</p>
              <p className="text-primary-200">User mới</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent-300 mb-1">{formatPrice(2400000)}</p>
              <p className="text-primary-200">Doanh thu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
