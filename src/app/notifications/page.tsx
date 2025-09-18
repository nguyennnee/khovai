'use client';

import { useState, useEffect } from 'react';
import { notificationsAPI, Notification } from '@/lib/services/api';
import { Bell, Check, X, Settings, Filter, Clock, Star, ShoppingBag, Heart, MessageCircle, Sun, Mail, Send } from 'lucide-react';

const notificationTypes = [
  { key: 'all', label: 'Tất cả', icon: Bell },
  { key: 'new_arrival', label: 'Hàng mới', icon: Star },
  { key: 'sale', label: 'Khuyến mãi', icon: Heart },
  { key: 'order_update', label: 'Đơn hàng', icon: ShoppingBag },
  { key: 'system', label: 'Hệ thống', icon: MessageCircle }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    new_arrival: true,
    sale: true,
    order_update: true,
    system: true
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsAPI.getUserNotifications({ limit: 100 });
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const filteredNotifications = notifications.filter(notification => {
    if (selectedType === 'all') return true;
    return notification.type === selectedType;
  });

  const markAsRead = async (id: number) => {
    try {
      // Update local state immediately for better UX
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      
      // Call API to mark as read
      // Note: This would need to be implemented in the backend
      // await notificationsAPI.markAsRead(id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert local state on error
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: false } : n)
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update local state immediately
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      
      // Call API to mark all as read
      // await notificationsAPI.markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      // Update local state immediately
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      // Call API to delete
      // await notificationsAPI.deleteNotification(id);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_arrival':
        return <Star className="h-5 w-5 text-accent-500" />;
      case 'sale':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'order_update':
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'system':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_arrival':
        return 'bg-accent-50 border-accent-200';
      case 'sale':
        return 'bg-red-50 border-red-200';
      case 'order_update':
        return 'bg-blue-50 border-blue-200';
      case 'reminder':
        return 'bg-yellow-50 border-yellow-200';
      case 'system':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-primary-50 border-primary-200';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-vintage-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg border">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-8 w-8 text-accent-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-primary-900">
                  Thông báo
                </h1>
                <p className="text-primary-600">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-accent-600 hover:text-accent-700 font-semibold transition-colors"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-primary-600 hover:text-accent-500 hover:bg-accent-50 rounded-lg transition-all duration-300"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings Panel */}
      {showSettings && (
        <div className="bg-accent-50 border-b border-accent-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h3 className="font-semibold text-primary-800 mb-3">Cài đặt thông báo</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emailSettings.new_arrival}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, new_arrival: e.target.checked }))}
                  className="text-accent-500" 
                />
                <span className="text-sm text-primary-700">Hàng mới về</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emailSettings.sale}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, sale: e.target.checked }))}
                  className="text-accent-500" 
                />
                <span className="text-sm text-primary-700">Khuyến mãi</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emailSettings.order_update}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, order_update: e.target.checked }))}
                  className="text-accent-500" 
                />
                <span className="text-sm text-primary-700">Cập nhật đơn hàng</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={emailSettings.system}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, system: e.target.checked }))}
                  className="text-accent-500" 
                />
                <span className="text-sm text-primary-700">Email thông báo</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {notificationTypes.map((type) => {
            const Icon = type.icon;
            const count = type.key === 'all' 
              ? notifications.length 
              : notifications.filter(n => n.type === type.key).length;
            
            return (
              <button
                key={type.key}
                onClick={() => setSelectedType(type.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                  selectedType === type.key
                    ? 'bg-accent-500 text-white shadow-accent'
                    : 'bg-white text-primary-700 hover:bg-accent-50 border border-primary-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{type.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedType === type.key 
                    ? 'bg-white/20 text-white' 
                    : 'bg-primary-100 text-primary-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl shadow-vintage overflow-hidden transition-all duration-300 hover:shadow-xl border-l-4 ${
                  !notification.is_read 
                    ? 'border-l-accent-500 bg-accent-50/30' 
                    : 'border-l-primary-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-xl ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${
                              !notification.is_read ? 'text-primary-900' : 'text-primary-700'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          
                          <p className="text-primary-600 mb-2 leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-primary-500 flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatTime(notification.created_at)}
                            </span>
                            
                            {notification.action_url && (
                              <a
                                href={notification.action_url}
                                className="text-accent-600 hover:text-accent-700 font-semibold text-sm transition-colors"
                              >
                                {notification.action_text || 'Xem chi tiết'}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300"
                              title="Đánh dấu đã đọc"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
                            title="Xóa thông báo"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="h-16 w-16 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-2">
              {selectedType === 'all' ? 'Chưa có thông báo nào' : 'Không có thông báo loại này'}
            </h3>
            <p className="text-primary-600 mb-6">
              {selectedType === 'all' 
                ? 'Các thông báo mới sẽ xuất hiện ở đây'
                : 'Thử chọn loại thông báo khác để xem'
              }
            </p>
            {selectedType !== 'all' && (
              <button
                onClick={() => setSelectedType('all')}
                className="btn-primary"
              >
                Xem tất cả thông báo
              </button>
            )}
          </div>
        )}

        {/* Notification Preferences */}
        <div className="mt-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 text-center text-white">
          <Sun className="h-12 w-12 mx-auto mb-4 text-accent-200" />
          <h3 className="font-display text-2xl font-bold mb-2">
            Không bỏ lỡ những cập nhật mới! 🔔
          </h3>
          <p className="text-accent-100 mb-6">
            Bật thông báo để luôn cập nhật các sản phẩm hot và ưu đãi độc quyền
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-white text-accent-600 font-semibold px-6 py-3 rounded-full hover:bg-vintage-cream transition-colors"
            >
              Cài đặt thông báo
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-full hover:bg-white/30 transition-colors border border-white/20">
              Đăng ký email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}