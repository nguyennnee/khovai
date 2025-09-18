'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  Crown,
  LogOut,
  Sun,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const sidebarItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'Quản lý sản phẩm',
    href: '/admin/products',
    icon: Package
  },
  {
    name: 'Quản lý đơn hàng',
    href: '/admin/orders',
    icon: ShoppingCart
  },
  {
    name: 'Quản lý người dùng',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'Blog & Lookbook',
    href: '/admin/blog',
    icon: FileText
  },
  {
    name: 'Thông báo',
    href: '/admin/notifications',
    icon: Bell
  },
  {
    name: 'Thống kê & Báo cáo',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    name: 'Cài đặt',
    href: '/admin/settings',
    icon: Settings
  }
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (item: typeof sidebarItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-vintage-cream flex w-full">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:relative lg:flex lg:flex-col`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-primary-900">
          <div className="flex items-center gap-2">
            <Crown className="h-8 w-8 text-accent-300" />
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-accent-200">Admin</span>
              <span className="text-xs text-primary-300">lil.shunshine.thrift</span>
            </div>
          </div>
          
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-primary-300 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-primary-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {user?.full_name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium truncate">{user?.full_name || 'Admin'}</p>
              <p className="text-primary-300 text-sm truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-accent-500 text-white shadow-lg'
                    : 'text-primary-300 hover:text-white hover:bg-primary-700'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-primary-400 group-hover:text-white'}`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-primary-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-primary-300 hover:text-white hover:bg-primary-700 rounded-xl transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-primary-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-primary-600 hover:text-accent-500 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="hidden md:flex items-center gap-3">
              <Sun className="h-6 w-6 text-accent-500" />
              <h1 className="text-xl font-bold text-primary-900">
                {pathname === '/admin' ? 'Dashboard' :
                 pathname.includes('/products') ? 'Quản lý sản phẩm' :
                 pathname.includes('/orders') ? 'Quản lý đơn hàng' :
                 pathname.includes('/users') ? 'Quản lý người dùng' :
                 pathname.includes('/blog') ? 'Blog & Lookbook' :
                 pathname.includes('/analytics') ? 'Thống kê & Báo cáo' :
                 pathname.includes('/settings') ? 'Cài đặt' : 'Admin'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-primary-50 rounded-lg px-3 py-2 w-64">
              <Search className="h-4 w-4 text-primary-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="flex-1 bg-transparent border-none outline-none text-primary-700 placeholder-primary-400"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-primary-600 hover:text-accent-500 hover:bg-accent-50 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            {/* View Site Link */}
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent-50 text-accent-600 hover:bg-accent-100 rounded-lg transition-colors"
            >
              <Sun className="h-4 w-4" />
              <span className="font-medium">Xem site</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
