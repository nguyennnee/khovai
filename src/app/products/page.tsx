'use client';

import { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, ChevronDown, Plus } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { productsAPI } from '@/lib/services/api';
import { Product, ProductFilter } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import QuickAddProduct from '@/components/QuickAddProduct';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilter>({
    page: 1,
    per_page: 20,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productsAPI.getProducts(filters);
      // Handle both array response and object response
      if (Array.isArray(response)) {
        setProducts(response);
        setTotalPages(1); // Default to 1 page for array response
      } else {
        setProducts(response.products || []);
        setTotalPages(response.pages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ProductFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-white border-b border-primary-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-primary-900">
                Tất cả sản phẩm
              </h1>
              <p className="text-primary-600 mt-1">
                Khám phá bộ sưu tập thrift & vintage độc đáo
              </p>
            </div>

            {/* Search & Controls */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 w-64"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-primary-100 hover:bg-primary-200 px-4 py-2 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                Bộ lọc
              </button>

              {/* Quick Add Button for Admin */}
              {isAuthenticated && user?.role === 'admin' && (
                <QuickAddProduct 
                  onProductAdded={fetchProducts}
                  buttonText="Thêm nhanh"
                  buttonIcon={<Plus className="h-4 w-4" />}
                  className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white hover:bg-accent-600 rounded-lg transition-colors"
                />
              )}

              <div className="flex items-center gap-2 bg-primary-50 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-primary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Danh mục
                </label>
                <select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="vintage">Vintage</option>
                  <option value="y2k">Y2K</option>
                  <option value="streetwear">Streetwear</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  placeholder="Nike, Adidas..."
                  value={filters.brand || ''}
                  onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                />
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Tình trạng
                </label>
                <select
                  value={filters.condition || ''}
                  onChange={(e) => handleFilterChange('condition', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                >
                  <option value="">Tất cả</option>
                  <option value="90% new">90% mới</option>
                  <option value="80% new">80% mới</option>
                  <option value="70% new">70% mới</option>
                  <option value="60% new">60% mới</option>
                  <option value="vintage">Vintage</option>
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  placeholder="S, M, L..."
                  value={filters.size || ''}
                  onChange={(e) => handleFilterChange('size', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                />
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Giá từ
                </label>
                <input
                  type="number"
                  placeholder="100000"
                  value={filters.min_price || ''}
                  onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">
                  Giá đến
                </label>
                <input
                  type="number"
                  placeholder="1000000"
                  value={filters.max_price || ''}
                  onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-vintage overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-primary-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-primary-200 rounded mb-3"></div>
                  <div className="h-6 bg-primary-200 rounded mb-3"></div>
                  <div className="h-4 bg-primary-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-primary-600">
                Hiển thị <span className="font-semibold">{products?.length || 0}</span> sản phẩm
              </p>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(filters.page! - 1)}
                    disabled={filters.page === 1}
                    className="px-4 py-2 border border-primary-300 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        filters.page === i + 1
                          ? 'bg-accent-500 text-white'
                          : 'border border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(filters.page! + 1)}
                    disabled={filters.page === totalPages}
                    className="px-4 py-2 border border-primary-300 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tiếp
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-16 w-16 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-primary-800 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-primary-600 mb-6">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <button
              onClick={() => setFilters({ page: 1, per_page: 20 })}
              className="btn-primary"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
