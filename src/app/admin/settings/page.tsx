'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Settings, 
  Bell, 
  Mail, 
  Shield, 
  Eye, 
  EyeOff, 
  User, 
  Store, 
  Palette, 
  Globe, 
  Smartphone, 
  CreditCard,
  Truck,
  FileText,
  Database,
  Key,
  AlertCircle,
  CheckCircle,
  Upload,
  Download,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { settingsAPI } from '@/lib/services/api';
import { useToast } from '@/contexts/ToastContext';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [loading, setLoading] = useState(true);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getSettings();
      setSettings(response.settings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaveStatus('saving');
      await settingsAPI.updateSettings(settings);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const resetSettings = async () => {
    if (confirm('Bạn có chắc chắn muốn reset tất cả cài đặt về mặc định?')) {
      try {
        await settingsAPI.resetSettings();
        await loadSettings();
        showToast({
          type: 'success',
          title: 'Reset cài đặt thành công!',
          message: 'Cài đặt đã được reset về mặc định.',
          duration: 3000
        });
      } catch (error) {
        console.error('Failed to reset settings:', error);
        showToast({
          type: 'error',
          title: 'Lỗi reset cài đặt',
          message: 'Có lỗi xảy ra khi reset cài đặt. Vui lòng thử lại.',
          duration: 4000
        });
      }
    }
  };

  // Settings state
  const [settings, setSettings] = useState({
    general: {
      siteName: 'lil.shunshine.thrift',
      siteDescription: 'Săn đồ độc - sống xanh - phong cách riêng',
      contactEmail: 'contact@lil.shunshine.thrift',
      phone: '0777746925',
      address: 'Cần Thơ, Việt Nam',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi'
    },
    notifications: {
      emailNewOrders: true,
      emailNewUsers: true,
      emailLowStock: true,
      emailWeeklyReport: true,
      pushNewOrders: true,
      pushSystemAlerts: true
    },
    security: {
      twoFactorEnabled: false,
      passwordMinLength: 8,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      requireEmailVerification: true
    },
    payment: {
      enableCOD: true,
      enableMomo: true,
      enableVNPay: false,
      enableBankTransfer: true,
      codFee: 25000,
      freeShippingThreshold: 500000
    },
    shipping: {
      standardShippingFee: 25000,
      expressShippingFee: 50000,
      freeShippingThreshold: 500000,
      processingTime: '1-2 ngày',
      deliveryTime: '2-5 ngày'
    },
    inventory: {
      lowStockThreshold: 5,
      autoHideSoldOut: true,
      allowBackorders: false,
      stockReservationTime: 10
    }
  });

  const tabs = [
    { id: 'general', name: 'Tổng quan', icon: Store },
    { id: 'notifications', name: 'Thông báo', icon: Bell },
    { id: 'security', name: 'Bảo mật', icon: Shield },
    { id: 'payment', name: 'Thanh toán', icon: CreditCard },
    { id: 'shipping', name: 'Vận chuyển', icon: Truck },
    { id: 'inventory', name: 'Kho hàng', icon: Database },
    { id: 'backup', name: 'Sao lưu', icon: Download }
  ];

  const handleSave = async () => {
    await saveSettings();
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Tên website
            </label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Email liên hệ
            </label>
            <input
              type="email"
              value={settings.general.contactEmail}
              onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={settings.general.phone}
              onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Múi giờ
            </label>
            <select
              value={settings.general.timezone}
              onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
              <option value="Asia/Bangkok">Thailand (GMT+7)</option>
              <option value="Asia/Singapore">Singapore (GMT+8)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Mô tả website
          </label>
          <textarea
            value={settings.general.siteDescription}
            onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Địa chỉ
          </label>
          <textarea
            value={settings.general.address}
            onChange={(e) => handleInputChange('general', 'address', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Thông báo Email</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNewOrders', label: 'Đơn hàng mới', description: 'Nhận thông báo khi có đơn hàng mới' },
            { key: 'emailNewUsers', label: 'Người dùng mới', description: 'Nhận thông báo khi có user đăng ký mới' },
            { key: 'emailLowStock', label: 'Hết hàng', description: 'Nhận thông báo khi sản phẩm sắp hết' },
            { key: 'emailWeeklyReport', label: 'Báo cáo hàng tuần', description: 'Báo cáo tổng kết cuối tuần' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
              <div>
                <p className="font-medium text-primary-900">{item.label}</p>
                <p className="text-sm text-primary-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key]}
                  onChange={(e) => handleInputChange('notifications', item.key, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full ${settings.notifications[item.key] ? 'bg-accent-500' : 'bg-gray-300'} relative transition-colors`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Thông báo đẩy</h3>
        <div className="space-y-4">
          {[
            { key: 'pushNewOrders', label: 'Đơn hàng mới', description: 'Thông báo đẩy cho đơn hàng mới' },
            { key: 'pushSystemAlerts', label: 'Cảnh báo hệ thống', description: 'Thông báo lỗi và cảnh báo quan trọng' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
              <div>
                <p className="font-medium text-primary-900">{item.label}</p>
                <p className="text-sm text-primary-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key]}
                  onChange={(e) => handleInputChange('notifications', item.key, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full ${settings.notifications[item.key] ? 'bg-accent-500' : 'bg-gray-300'} relative transition-colors`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Xác thực</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
            <div>
              <p className="font-medium text-primary-900">Xác thực 2 bước</p>
              <p className="text-sm text-primary-600">Tăng cường bảo mật với mã OTP</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.twoFactorEnabled}
                onChange={(e) => handleInputChange('security', 'twoFactorEnabled', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full ${settings.security.twoFactorEnabled ? 'bg-accent-500' : 'bg-gray-300'} relative transition-colors`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.security.twoFactorEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
            <div>
              <p className="font-medium text-primary-900">Xác thực email</p>
              <p className="text-sm text-primary-600">Yêu cầu xác thực email khi đăng ký</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security.requireEmailVerification}
                onChange={(e) => handleInputChange('security', 'requireEmailVerification', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full ${settings.security.requireEmailVerification ? 'bg-accent-500' : 'bg-gray-300'} relative transition-colors`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.security.requireEmailVerification ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Chính sách mật khẩu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Độ dài tối thiểu
            </label>
            <input
              type="number"
              min="6"
              max="20"
              value={settings.security.passwordMinLength}
              onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Thời gian phiên (phút)
            </label>
            <input
              type="number"
              min="15"
              max="120"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Số lần đăng nhập sai tối đa
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={settings.security.maxLoginAttempts}
              onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Phương thức thanh toán</h3>
        <div className="space-y-4">
          {[
            { key: 'enableCOD', label: 'COD (Thu hộ)', description: 'Thanh toán khi nhận hàng' },
            { key: 'enableMomo', label: 'MoMo', description: 'Ví điện tử MoMo' },
            { key: 'enableVNPay', label: 'VNPay', description: 'Cổng thanh toán VNPay' },
            { key: 'enableBankTransfer', label: 'Chuyển khoản', description: 'Chuyển khoản ngân hàng' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
              <div>
                <p className="font-medium text-primary-900">{item.label}</p>
                <p className="text-sm text-primary-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.payment[item.key]}
                  onChange={(e) => handleInputChange('payment', item.key, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full ${settings.payment[item.key] ? 'bg-accent-500' : 'bg-gray-300'} relative transition-colors`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.payment[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Phí và khuyến mãi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Phí COD (VNĐ)
            </label>
            <input
              type="number"
              value={settings.payment.codFee}
              onChange={(e) => handleInputChange('payment', 'codFee', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Miễn phí ship từ (VNĐ)
            </label>
            <input
              type="number"
              value={settings.payment.freeShippingThreshold}
              onChange={(e) => handleInputChange('payment', 'freeShippingThreshold', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Phí vận chuyển</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Giao hàng tiêu chuẩn (VNĐ)
            </label>
            <input
              type="number"
              value={settings.shipping.standardShippingFee}
              onChange={(e) => handleInputChange('shipping', 'standardShippingFee', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Giao hàng nhanh (VNĐ)
            </label>
            <input
              type="number"
              value={settings.shipping.expressShippingFee}
              onChange={(e) => handleInputChange('shipping', 'expressShippingFee', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Miễn phí ship từ (VNĐ)
            </label>
            <input
              type="number"
              value={settings.shipping.freeShippingThreshold}
              onChange={(e) => handleInputChange('shipping', 'freeShippingThreshold', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Thời gian xử lý</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Thời gian xử lý đơn hàng
            </label>
            <input
              type="text"
              value={settings.shipping.processingTime}
              onChange={(e) => handleInputChange('shipping', 'processingTime', e.target.value)}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Thời gian giao hàng
            </label>
            <input
              type="text"
              value={settings.shipping.deliveryTime}
              onChange={(e) => handleInputChange('shipping', 'deliveryTime', e.target.value)}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventorySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Quản lý tồn kho</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Ngưỡng cảnh báo hết hàng
            </label>
            <input
              type="number"
              min="0"
              value={settings.inventory.lowStockThreshold}
              onChange={(e) => handleInputChange('inventory', 'lowStockThreshold', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Thời gian giữ hàng (phút)
            </label>
            <input
              type="number"
              min="5"
              max="30"
              value={settings.inventory.stockReservationTime}
              onChange={(e) => handleInputChange('inventory', 'stockReservationTime', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Hiển thị sản phẩm</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
            <div>
              <p className="font-medium text-primary-900">Tự động ẩn sản phẩm hết hàng</p>
              <p className="text-sm text-primary-600">Ẩn sản phẩm khỏi danh sách khi hết hàng</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.inventory.autoHideSoldOut}
                onChange={(e) => handleInputChange('inventory', 'autoHideSoldOut', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full ${settings.inventory.autoHideSoldOut ? 'bg-accent-500' : 'bg-gray-300'} relative transition-colors`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.inventory.autoHideSoldOut ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
            <div>
              <p className="font-medium text-primary-900">Cho phép đặt trước</p>
              <p className="text-sm text-primary-600">Cho phép đặt hàng khi sản phẩm hết</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.inventory.allowBackorders}
                onChange={(e) => handleInputChange('inventory', 'allowBackorders', e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full ${settings.inventory.allowBackorders ? 'bg-accent-500' : 'bg-gray-300'} relative transition-colors`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${settings.inventory.allowBackorders ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Sao lưu dữ liệu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Download className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900">Sao lưu thủ công</h4>
                <p className="text-sm text-blue-700">Tạo bản sao lưu ngay bây giờ</p>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Tạo bản sao lưu
            </button>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Sao lưu tự động</h4>
                <p className="text-sm text-green-700">Lần cuối: Hôm qua 03:00</p>
              </div>
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
              Cấu hình tự động
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Khôi phục dữ liệu</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900 mb-2">Cảnh báo quan trọng</h4>
              <p className="text-yellow-800 mb-4">
                Khôi phục dữ liệu sẽ ghi đè toàn bộ dữ liệu hiện tại. Hãy chắc chắn bạn đã sao lưu dữ liệu trước khi thực hiện.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".sql,.zip"
                  className="hidden"
                  id="restore-file"
                />
                <label 
                  htmlFor="restore-file"
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer"
                >
                  Chọn file khôi phục
                </label>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Khôi phục dữ liệu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Lịch sử sao lưu</h3>
        <div className="space-y-3">
          {[
            { date: '2024-09-11 03:00', size: '2.4 MB', type: 'Tự động' },
            { date: '2024-09-10 03:00', size: '2.3 MB', type: 'Tự động' },
            { date: '2024-09-09 15:30', size: '2.3 MB', type: 'Thủ công' },
            { date: '2024-09-09 03:00', size: '2.2 MB', type: 'Tự động' }
          ].map((backup, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="font-medium text-primary-900">{backup.date}</p>
                  <p className="text-sm text-primary-600">{backup.type} • {backup.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'payment':
        return renderPaymentSettings();
      case 'shipping':
        return renderShippingSettings();
      case 'inventory':
        return renderInventorySettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-900 mb-2">Cài đặt hệ thống</h1>
            <p className="text-primary-600">Quản lý cấu hình và tùy chỉnh website</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
              saveStatus === 'saving' 
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : saveStatus === 'saved'
                ? 'bg-green-500 text-white'
                : 'bg-accent-500 text-white hover:bg-accent-600'
            }`}
          >
            {saveStatus === 'saving' && <RefreshCw className="h-4 w-4 animate-spin" />}
            {saveStatus === 'saved' && <CheckCircle className="h-4 w-4" />}
            {saveStatus === 'idle' && <Save className="h-4 w-4" />}
            {saveStatus === 'saving' ? 'Đang lưu...' : 
             saveStatus === 'saved' ? 'Đã lưu!' : 'Lưu thay đổi'}
          </button>
          
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-all duration-300"
          >
            <Trash2 className="h-4 w-4" />
            Reset về mặc định
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-vintage p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                      activeTab === tab.id
                        ? 'bg-accent-500 text-white shadow-lg'
                        : 'text-primary-600 hover:text-accent-600 hover:bg-accent-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-vintage p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
