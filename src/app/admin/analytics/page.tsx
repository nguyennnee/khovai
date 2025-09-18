'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Package, 
  Eye, 
  Heart, 
  Calendar, 
  Download, 
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Target,
  Star,
  Clock,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { ordersAPI, usersAPI, productsAPI, blogAPI, notificationsAPI } from '@/lib/services/api';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
      totalBlogPosts: 0,
      totalNotifications: 0,
      growthRate: {
        revenue: 0,
        orders: 0,
        users: 0,
        products: 0
      }
    },
    orderStats: {
      total_orders: 0,
      pending_orders: 0,
      confirmed_orders: 0,
      shipped_orders: 0,
      delivered_orders: 0,
      total_revenue: 0
    },
    userStats: {
      total_users: 0,
      active_users: 0,
      admin_users: 0,
      new_users_today: 0,
      new_users_this_month: 0
    },
    blogStats: {
      total_posts: 0,
      published_posts: 0,
      draft_posts: 0,
      total_views: 0,
      total_likes: 0,
      total_comments: 0
    },
    notificationStats: {
      total_notifications: 0,
      sent_notifications: 0,
      pending_notifications: 0,
      total_recipients: 0,
      email_notifications: 0,
      in_app_notifications: 0
    }
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [orderStats, userStats, blogStats, notificationStats, productsData] = await Promise.all([
        ordersAPI.getOrderStats(),
        usersAPI.getUserStats(),
        blogAPI.getBlogStats(),
        notificationsAPI.getNotificationStats(),
        productsAPI.getProducts({ limit: 1000 })
      ]);

      setAnalyticsData({
        overview: {
          totalRevenue: orderStats.total_revenue || 0,
          totalOrders: orderStats.total_orders || 0,
          totalUsers: userStats.total_users || 0,
          totalProducts: productsData.products?.length || 0,
          totalBlogPosts: blogStats.total_posts || 0,
          totalNotifications: notificationStats.total_notifications || 0,
          growthRate: {
            revenue: 0, // Would need historical data to calculate
            orders: 0,
            users: 0,
            products: 0
          }
        },
        orderStats,
        userStats,
        blogStats,
        notificationStats
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thống kê & Báo cáo</h1>
          <p className="text-gray-600">Tổng quan về hoạt động của website</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </button>
          <button 
            onClick={fetchAnalyticsData}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.overview.totalRevenue)}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalOrders)}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalUsers)}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.totalProducts)}
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Statistics */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê đơn hàng</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đơn hàng chờ xác nhận</span>
              <span className="font-semibold text-yellow-600">
                {analyticsData.orderStats.pending_orders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đơn hàng đã xác nhận</span>
              <span className="font-semibold text-blue-600">
                {analyticsData.orderStats.confirmed_orders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đơn hàng đang giao</span>
              <span className="font-semibold text-purple-600">
                {analyticsData.orderStats.shipped_orders}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đơn hàng đã giao</span>
              <span className="font-semibold text-green-600">
                {analyticsData.orderStats.delivered_orders}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Tổng doanh thu</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(analyticsData.orderStats.total_revenue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Statistics */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê người dùng</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Người dùng hoạt động</span>
              <span className="font-semibold text-green-600">
                {analyticsData.userStats.active_users}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quản trị viên</span>
              <span className="font-semibold text-purple-600">
                {analyticsData.userStats.admin_users}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Người dùng mới hôm nay</span>
              <span className="font-semibold text-blue-600">
                {analyticsData.userStats.new_users_today}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Người dùng mới tháng này</span>
              <span className="font-semibold text-orange-600">
                {analyticsData.userStats.new_users_this_month}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Tổng người dùng</span>
                <span className="font-bold text-primary-600">
                  {analyticsData.userStats.total_users}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Blog Statistics */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê Blog & Lookbook</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Bài viết đã xuất bản</span>
              <span className="font-semibold text-green-600">
                {analyticsData.blogStats.published_posts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Bài viết bản nháp</span>
              <span className="font-semibold text-yellow-600">
                {analyticsData.blogStats.draft_posts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng lượt xem</span>
              <span className="font-semibold text-blue-600">
                {formatNumber(analyticsData.blogStats.total_views)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng lượt thích</span>
              <span className="font-semibold text-red-600">
                {formatNumber(analyticsData.blogStats.total_likes)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng bình luận</span>
              <span className="font-semibold text-purple-600">
                {formatNumber(analyticsData.blogStats.total_comments)}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Tổng bài viết</span>
                <span className="font-bold text-primary-600">
                  {analyticsData.blogStats.total_posts}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Statistics */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê thông báo</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Thông báo đã gửi</span>
              <span className="font-semibold text-green-600">
                {analyticsData.notificationStats.sent_notifications}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Thông báo chờ gửi</span>
              <span className="font-semibold text-yellow-600">
                {analyticsData.notificationStats.pending_notifications}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email thông báo</span>
              <span className="font-semibold text-blue-600">
                {analyticsData.notificationStats.email_notifications}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">In-app thông báo</span>
              <span className="font-semibold text-purple-600">
                {analyticsData.notificationStats.in_app_notifications}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng người nhận</span>
              <span className="font-semibold text-orange-600">
                {formatNumber(analyticsData.notificationStats.total_recipients)}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Tổng thông báo</span>
                <span className="font-bold text-primary-600">
                  {analyticsData.notificationStats.total_notifications}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hành động nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-medium">Báo cáo doanh thu</span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">Báo cáo người dùng</span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Package className="h-5 w-5 text-purple-600" />
            <span className="text-purple-800 font-medium">Báo cáo sản phẩm</span>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <Download className="h-5 w-5 text-orange-600" />
            <span className="text-orange-800 font-medium">Xuất dữ liệu</span>
          </button>
        </div>
      </div>
    </div>
  );
}