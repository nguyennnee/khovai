'use client';

import Link from 'next/link';
import { ShoppingBag, User, Bell, Menu, X, Sun, ChevronDown, LogOut, Package, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cartAPI, notificationsAPI } from '@/lib/services/api';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  // Load cart and notification counts
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCounts();
    } else {
      setCartCount(0);
      setNotificationCount(0);
    }
  }, [isAuthenticated, user]);

  const loadCounts = async () => {
    try {
      // Load cart count
      const cart = await cartAPI.getCart();
      setCartCount(cart.total_items || 0);

      // Load notification count
      const notifications = await notificationsAPI.getUserNotifications({ limit: 100 });
      const unreadCount = notifications.filter(n => !n.is_read).length;
      setNotificationCount(unreadCount);
    } catch (error) {
      console.error('Error loading counts:', error);
      setCartCount(0);
      setNotificationCount(0);
    }
  };

  // Expose refresh function for external use
  const refreshCounts = () => {
    if (isAuthenticated && user) {
      loadCounts();
    }
  };

  // Listen for storage events to refresh counts when cart changes
  useEffect(() => {
    const handleStorageChange = () => {
      refreshCounts();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthenticated, user]);

  return (
    <nav className="bg-vintage-cream shadow-lg border-b-2 border-accent-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Retro Style */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="flex items-center gap-2">
              <Sun className="h-8 w-8 text-accent-200 group-hover:text-accent-300 animate-bounce-gentle" />
              <div className="flex flex-col">
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-accent-500 group-hover:text-accent-600 transition-colors leading-tight">
                  lil.shunshine
                </h1>
                <span className="font-display text-lg font-semibold text-primary-600 group-hover:text-primary-700 transition-colors leading-tight -mt-1">
                  thrift
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link 
              href="/" 
              className="relative text-primary-700 hover:text-accent-500 font-semibold transition-colors group"
            >
              Trang chủ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/products" 
              className="relative text-primary-700 hover:text-accent-500 font-semibold transition-colors group"
            >
              Sản phẩm
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/blog" 
              className="relative text-primary-700 hover:text-accent-500 font-semibold transition-colors group"
            >
              Blog / Lookbook
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              href="/about" 
              className="relative text-primary-700 hover:text-accent-500 font-semibold transition-colors group"
            >
              Giới thiệu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-200 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Notifications Bell */}
            <Link href="/notifications" className="relative p-3 text-primary-600 hover:text-accent-500 hover:bg-accent-50 rounded-full transition-all duration-300 group">
              <Bell className="h-6 w-6 group-hover:animate-bounce-gentle" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {notificationCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart" className="relative p-3 text-primary-600 hover:text-accent-500 hover:bg-accent-50 rounded-full transition-all duration-300 group">
              <ShoppingBag className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Authentication */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-primary-700 hover:text-accent-500 hover:bg-accent-50 rounded-xl transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-200 to-accent-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.full_name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block font-medium">{user.full_name}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-vintage border border-primary-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-primary-200">
                      <p className="text-sm font-semibold text-primary-800">{user.full_name}</p>
                      <p className="text-xs text-primary-600">{user.email}</p>
                    </div>
                    
                    <Link 
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-primary-700 hover:bg-accent-50 hover:text-accent-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    
                    <Link 
                      href="/orders"
                      className="flex items-center gap-3 px-4 py-2 text-primary-700 hover:bg-accent-50 hover:text-accent-600 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      Đơn hàng
                    </Link>

                    {user.role === 'admin' && (
                      <Link 
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-primary-700 hover:bg-accent-50 hover:text-accent-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t border-primary-200 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/auth/login" 
                  className="px-4 py-2 text-primary-700 hover:text-accent-500 font-semibold transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link 
                  href="/auth/register" 
                  className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-accent"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-primary-600 hover:text-accent-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-primary-200 py-4 bg-vintage-cream/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-primary-700 hover:text-accent-500 font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-accent-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                href="/products" 
                className="text-primary-700 hover:text-accent-500 font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-accent-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link 
                href="/blog" 
                className="text-primary-700 hover:text-accent-500 font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-accent-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog / Lookbook
              </Link>
              <Link 
                href="/about" 
                className="text-primary-700 hover:text-accent-500 font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-accent-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Giới thiệu
              </Link>
              
              {!isAuthenticated && (
                <div className="border-t border-primary-200 pt-4 space-y-2">
                  <Link 
                    href="/auth/login" 
                    className="block text-primary-700 hover:text-accent-500 font-semibold transition-colors py-2 px-4 rounded-lg hover:bg-accent-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="block bg-accent-500 hover:bg-accent-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}