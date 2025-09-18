'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera, Shield, Heart, ShoppingBag, Star, Sun, Calendar, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/services/api';

export default function ProfilePage() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Có lỗi xảy ra khi cập nhật profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-vintage-cream flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-vintage max-w-md">
          <Shield className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary-900 mb-4">Chưa đăng nhập</h1>
          <p className="text-primary-600 mb-6">Vui lòng đăng nhập để xem thông tin profile</p>
          <a href="/auth/login" className="btn-primary">
            Đăng nhập ngay
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <span className="text-3xl font-bold text-white">
                  {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-accent-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{user?.full_name || 'Người dùng'}</h1>
              <p className="text-accent-100 mb-1">{user?.email}</p>
              <div className="flex items-center gap-2 text-accent-200">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Thành viên từ {new Date(user?.created_at || '').toLocaleDateString('vi-VN')}</span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 border border-white/20"
            >
              {isEditing ? (
                <>
                  <X className="h-5 w-5 inline mr-2" />
                  Hủy
                </>
              ) : (
                <>
                  <Edit2 className="h-5 w-5 inline mr-2" />
                  Chỉnh sửa
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-vintage p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-primary-900">
                  Thông tin cá nhân
                </h2>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-accent-500 hover:bg-accent-600 disabled:bg-accent-400 text-white px-6 py-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-2">
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                      <User className="h-5 w-5 text-primary-600" />
                      <span className="text-primary-800 font-medium">{user?.full_name || 'Chưa cập nhật'}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <span className="text-primary-800 font-medium">{user?.email}</span>
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Đã xác minh
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-2">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                      <Phone className="h-5 w-5 text-primary-600" />
                      <span className="text-primary-800 font-medium">{user?.phone || 'Chưa cập nhật'}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-2">
                    Địa chỉ
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  ) : (
                    <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
                      <span className="text-primary-800 font-medium">{user?.address || 'Chưa cập nhật'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl shadow-vintage p-8">
              <h3 className="font-display text-xl font-bold text-primary-900 mb-6">
                Bảo mật tài khoản
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-primary-800">Mật khẩu</p>
                      <p className="text-sm text-primary-600">Cập nhật lần cuối: 30 ngày trước</p>
                    </div>
                  </div>
                  <button className="text-accent-600 hover:text-accent-700 font-semibold transition-colors">
                    Đổi mật khẩu
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-primary-800">Xác thực email</p>
                      <p className="text-sm text-green-600">Email đã được xác thực</p>
                    </div>
                  </div>
                  <span className="text-green-600">
                    ✓ Đã kích hoạt
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-accent-200" />
                <h3 className="font-bold text-lg">Thống kê mua sắm</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-accent-100">Tổng đơn hàng</span>
                  <span className="font-bold text-xl">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-accent-100">Sản phẩm yêu thích</span>
                  <span className="font-bold text-xl">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-accent-100">Điểm tích lũy</span>
                  <span className="font-bold text-xl">2,450</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-vintage p-6">
              <h3 className="font-bold text-primary-900 mb-4">Thao tác nhanh</h3>
              
              <div className="space-y-3">
                <a
                  href="/orders"
                  className="flex items-center gap-3 p-3 hover:bg-primary-50 rounded-xl transition-colors group"
                >
                  <ShoppingBag className="h-5 w-5 text-primary-600 group-hover:text-accent-500" />
                  <span className="font-medium text-primary-700 group-hover:text-accent-600">Đơn hàng của tôi</span>
                </a>
                
                <a
                  href="/wishlist"
                  className="flex items-center gap-3 p-3 hover:bg-primary-50 rounded-xl transition-colors group"
                >
                  <Heart className="h-5 w-5 text-primary-600 group-hover:text-accent-500" />
                  <span className="font-medium text-primary-700 group-hover:text-accent-600">Sản phẩm yêu thích</span>
                </a>
                
                <a
                  href="/reviews"
                  className="flex items-center gap-3 p-3 hover:bg-primary-50 rounded-xl transition-colors group"
                >
                  <Star className="h-5 w-5 text-primary-600 group-hover:text-accent-500" />
                  <span className="font-medium text-primary-700 group-hover:text-accent-600">Đánh giá của tôi</span>
                </a>
              </div>
            </div>

            {/* Membership Card */}
            <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Sun className="h-6 w-6 text-accent-300" />
                <h3 className="font-bold text-lg">Thành viên VIP</h3>
              </div>
              
              <p className="text-primary-200 mb-4 text-sm">
                Mua thêm 500,000đ để lên hạng Platinum và nhận ưu đãi độc quyền!
              </p>
              
              <div className="bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-accent-400 rounded-full h-2 w-3/4"></div>
              </div>
              
              <p className="text-xs text-primary-300">
                Đã mua: 1,500,000đ / 2,000,000đ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
