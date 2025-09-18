'use client';

import { useState, useEffect } from 'react';
import { notificationsAPI, Notification } from '@/lib/services/api';
import { useToast } from '@/contexts/ToastContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  Bell, 
  Send, 
  Mail,
  Calendar,
  User,
  MoreHorizontal,
  Download,
  Clock,
  Star,
  ShoppingBag,
  Heart,
  MessageCircle,
  X,
  Save,
  Users,
  Activity
} from 'lucide-react';

export default function AdminNotificationsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [stats, setStats] = useState({
    total_notifications: 0,
    sent_notifications: 0,
    pending_notifications: 0,
    total_recipients: 0,
    email_notifications: 0,
    in_app_notifications: 0
  });

  // Form state for creating notifications
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'system',
    target_audience: 'all',
    send_email: false,
    action_text: '',
    action_url: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notificationsData, statsData] = await Promise.all([
        notificationsAPI.getNotifications({ limit: 100 }),
        notificationsAPI.getNotificationStats()
      ]);
      setNotifications(notificationsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        target_audience: formData.target_audience,
        send_email: formData.send_email,
        action_text: formData.action_text || null,
        action_url: formData.action_url || null
      };

      const newNotification = await notificationsAPI.createNotification(notificationData);
      
      // Send email if requested
      if (formData.send_email) {
        await notificationsAPI.sendEmailNotification({
          title: formData.title,
          message: formData.message,
          target_audience: formData.target_audience
        });
      }

      setNotifications(prev => [newNotification, ...prev]);
      setShowCreateForm(false);
      resetForm();
      showToast({
        type: 'success',
        title: 'Tạo thông báo thành công!',
        message: 'Thông báo đã được tạo và gửi thành công.',
        duration: 3000
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      showToast({
        type: 'error',
        title: 'Lỗi tạo thông báo',
        message: 'Có lỗi xảy ra khi tạo thông báo. Vui lòng thử lại.',
        duration: 4000
      });
    }
  };

  const handleDeleteNotification = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;
    
    try {
      // await notificationsAPI.deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      setSelectedNotifications(prev => prev.filter(notifId => notifId !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
      showToast({
        type: 'error',
        title: 'Lỗi xóa thông báo',
        message: 'Có lỗi xảy ra khi xóa thông báo. Vui lòng thử lại.',
        duration: 4000
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedNotifications.length === 0) {
      showToast({
        type: 'warning',
        title: 'Chưa chọn thông báo',
        message: 'Vui lòng chọn ít nhất một thông báo để thực hiện hành động.',
        duration: 3000
      });
      return;
    }

    try {
      switch (action) {
        case 'delete':
          if (confirm(`Bạn có chắc chắn muốn xóa ${selectedNotifications.length} thông báo?`)) {
            // await Promise.all(selectedNotifications.map(id => notificationsAPI.deleteNotification(id)));
            setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
            setSelectedNotifications([]);
          }
          break;
      }
    } catch (error) {
      console.error('Error in bulk action:', error);
      showToast({
        type: 'error',
        title: 'Lỗi thực hiện hành động',
        message: 'Có lỗi xảy ra khi thực hiện hành động. Vui lòng thử lại.',
        duration: 4000
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'system',
      target_audience: 'all',
      send_email: false,
      action_text: '',
      action_url: ''
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'Tất cả' || notification.type === selectedType;
    const matchesStatus = selectedStatus === 'Tất cả' || 
                         (selectedStatus === 'Đã gửi' && notification.is_sent) ||
                         (selectedStatus === 'Chờ gửi' && !notification.is_sent);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'new_arrival':
        return { 
          text: 'Hàng mới', 
          color: 'text-accent-600', 
          bg: 'bg-accent-50 border-accent-200',
          icon: Star
        };
      case 'sale':
        return { 
          text: 'Khuyến mãi', 
          color: 'text-red-600', 
          bg: 'bg-red-50 border-red-200',
          icon: Heart
        };
      case 'order_update':
        return { 
          text: 'Đơn hàng', 
          color: 'text-blue-600', 
          bg: 'bg-blue-50 border-blue-200',
          icon: ShoppingBag
        };
      case 'system':
        return { 
          text: 'Hệ thống', 
          color: 'text-green-600', 
          bg: 'bg-green-50 border-green-200',
          icon: MessageCircle
        };
      default:
        return { 
          text: 'Khác', 
          color: 'text-gray-600', 
          bg: 'bg-gray-50 border-gray-200',
          icon: Bell
        };
    }
  };

  const getStatusInfo = (isSent: boolean) => {
    if (isSent) {
      return { 
        text: 'Đã gửi', 
        color: 'text-green-600', 
        bg: 'bg-green-50 border-green-200' 
      };
    } else {
      return { 
        text: 'Chờ gửi', 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-50 border-yellow-200' 
      };
    }
  };

  const handleSelectNotification = (notificationId: number) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const showNotificationDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowNotificationDetail(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg border">
            <div className="h-12 bg-gray-200 rounded-t-lg"></div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý thông báo</h1>
          <p className="text-gray-600">Tạo và quản lý thông báo cho người dùng</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Tạo thông báo
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng thông báo</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_notifications}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã gửi</p>
              <p className="text-2xl font-bold text-green-600">{stats.sent_notifications}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Send className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ gửi</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending_notifications}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng người nhận</p>
              <p className="text-2xl font-bold text-purple-600">{stats.total_recipients}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.email_notifications}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Mail className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In-app</p>
              <p className="text-2xl font-bold text-orange-600">{stats.in_app_notifications}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg border mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, nội dung..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Tất cả">Tất cả loại</option>
              <option value="new_arrival">Hàng mới</option>
              <option value="sale">Khuyến mãi</option>
              <option value="order_update">Đơn hàng</option>
              <option value="system">Hệ thống</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Đã gửi">Đã gửi</option>
              <option value="Chờ gửi">Chờ gửi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              Đã chọn {selectedNotifications.length} thông báo
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('delete')}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onChange={(e) => handleSelectAll()}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông báo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const typeInfo = getTypeInfo(notification.type);
                const statusInfo = getStatusInfo(notification.is_sent);
                const Icon = typeInfo.icon;
                
                return (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={(e) => handleSelectNotification(notification.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {notification.message}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                          <Icon className={`h-4 w-4 ${typeInfo.color}`} />
                        </div>
                        <span className={`text-sm font-medium ${typeInfo.color}`}>
                          {typeInfo.text}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(notification.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showNotificationDetails(notification)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-16">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Không tìm thấy thông báo
          </h3>
          <p className="text-gray-600 mb-6">
            Thử thay đổi bộ lọc hoặc tạo thông báo mới
          </p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Tạo thông báo đầu tiên
          </button>
        </div>
      )}

      {/* Create Notification Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Tạo thông báo mới</h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề thông báo
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề thông báo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung thông báo
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  placeholder="Nhập nội dung thông báo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại thông báo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="system">Hệ thống</option>
                    <option value="new_arrival">Hàng mới</option>
                    <option value="sale">Khuyến mãi</option>
                    <option value="order_update">Đơn hàng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đối tượng nhận
                  </label>
                  <select
                    value={formData.target_audience}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả người dùng</option>
                    <option value="active">Người dùng hoạt động</option>
                    <option value="new">Người dùng mới</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hành động (tùy chọn)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.action_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, action_text: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Văn bản nút"
                  />
                  <input
                    type="text"
                    value={formData.action_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, action_url: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="URL liên kết"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="send_email"
                  checked={formData.send_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, send_email: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="send_email" className="ml-2 block text-sm text-gray-900">
                  Gửi email thông báo
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleCreateNotification}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Tạo thông báo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Detail Modal */}
      {showNotificationDetail && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Chi tiết thông báo</h2>
                <button
                  onClick={() => setShowNotificationDetail(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {selectedNotification.title}
                </h3>
                <p className="text-gray-700 mb-4">
                  {selectedNotification.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Loại:</span>
                  <p className="text-sm text-gray-900">
                    {getTypeInfo(selectedNotification.type).text}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Trạng thái:</span>
                  <p className="text-sm text-gray-900">
                    {getStatusInfo(selectedNotification.is_sent).text}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Ngày tạo:</span>
                  <p className="text-sm text-gray-900">
                    {formatDate(selectedNotification.created_at)}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Người tạo:</span>
                  <p className="text-sm text-gray-900">
                    {selectedNotification.created_by || 'Admin'}
                  </p>
                </div>
              </div>

              {selectedNotification.action_text && selectedNotification.action_url && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Hành động:</span>
                  <p className="text-sm text-gray-900">
                    {selectedNotification.action_text} → {selectedNotification.action_url}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowNotificationDetail(false)}
                  className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
