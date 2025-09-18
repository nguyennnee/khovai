'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  Package, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Upload,
  Download,
  MoreHorizontal,
  Grid3X3,
  List,
  Image as ImageIcon,
  Tag,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { productsAPI, Category, Product, getImageUrl } from '@/lib/services/api';
import { useToast } from '@/contexts/ToastContext';
import QuickAddProduct from '@/components/QuickAddProduct';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    newImages: [] as File[],
    removedImages: [] as number[],
    reorderedImages: [] as string[] // For drag & drop reordering
  });
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    size: '',
    condition: '',
    price: '',
    original_price: '',
    category_id: '',
    status: 'available',
    description: '',
    tags: '',
    is_featured: false,
    images: [] as File[]
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productsAPI.getProducts({ limit: 100 }),
        productsAPI.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      size: '',
      condition: '',
      price: '',
      original_price: '',
      category_id: '',
      status: 'available',
      description: '',
      tags: '',
      is_featured: false,
      images: []
    });
  };

  // Handle multiple image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // Remove image from form
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle new image upload for edit form
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setEditFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...files]
    }));
  };

  // Remove new image from edit form
  const removeNewImage = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
  };

  // Mark existing image for removal
  const markImageForRemoval = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      removedImages: [...prev.removedImages, index]
    }));
  };

  // Reset edit form data
  const resetEditForm = () => {
    setEditFormData({
      newImages: [],
      removedImages: [],
      reorderedImages: []
    });
    setDraggedIndex(null);
  };

  // Drag & Drop functions
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex || !editingProduct) return;

    const currentImages = editingProduct.images ? 
      (Array.isArray(editingProduct.images) ? editingProduct.images : JSON.parse(editingProduct.images || '[]')) : [];
    
    // Create new array with reordered images
    const newImages = [...currentImages];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged image from its original position
    newImages.splice(draggedIndex, 1);
    
    // Insert dragged image at new position
    newImages.splice(dropIndex, 0, draggedImage);
    
    // Update the product's images
    setEditingProduct({
      ...editingProduct,
      images: newImages
    });
    
    // Update reordered images for backend
    setEditFormData(prev => ({
      ...prev,
      reorderedImages: newImages
    }));
    
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || 
                           categories.find(c => c.id === product.category_id)?.name === selectedCategory;
    const matchesStatus = selectedStatus === 'Tất cả' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'available':
        return { 
          icon: CheckCircle, 
          text: 'Có sẵn', 
          color: 'text-green-600', 
          bg: 'bg-green-50 border-green-200' 
        };
      case 'reserved':
        return { 
          icon: Clock, 
          text: 'Đã giữ', 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-50 border-yellow-200' 
        };
      case 'sold':
        return { 
          icon: AlertCircle, 
          text: 'Đã bán', 
          color: 'text-red-600', 
          bg: 'bg-red-50 border-red-200' 
        };
      default:
        return { 
          icon: Package, 
          text: 'Không xác định', 
          color: 'text-gray-600', 
          bg: 'bg-gray-50 border-gray-200' 
        };
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setDeletingProduct(product);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    
    try {
      await productsAPI.deleteProduct(deletingProduct.id);
      setProducts(products.filter(p => p.id !== deletingProduct.id));
      setDeletingProduct(null);
      showToast({
        type: 'success',
        title: 'Xóa sản phẩm thành công!',
        message: `${deletingProduct.name} đã được xóa thành công.`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      showToast({
        type: 'error',
        title: 'Lỗi xóa sản phẩm',
        message: 'Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.',
        duration: 4000
      });
    }
  };

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      category_id: parseInt(formData.get('category_id') as string),
      price: parseFloat(formData.get('price') as string),
      original_price: formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : undefined,
      size: formData.get('size') as string,
      condition: formData.get('condition') as string,
      status: formData.get('status') as string,
      description: formData.get('description') as string,
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      is_featured: formData.get('is_featured') === 'on'
    };

    try {
      // Update basic product data with reordered images if any
      const finalProductData = {
        ...productData,
        images: editFormData.reorderedImages.length > 0 ? editFormData.reorderedImages : undefined
      };
      
      const updatedProduct = await productsAPI.updateProduct(editingProduct.id, finalProductData);
      
      // Handle image updates if there are changes
      if (editFormData.newImages.length > 0 || editFormData.removedImages.length > 0) {
        // Upload new images
        if (editFormData.newImages.length > 0) {
          const imageFormData = new FormData();
          editFormData.newImages.forEach((file, index) => {
            imageFormData.append('files', file);
          });
          
          try {
            await productsAPI.uploadProductImages(editingProduct.id, imageFormData);
          } catch (imageError) {
            console.error('Error uploading new images:', imageError);
            alert('Cập nhật sản phẩm thành công nhưng có lỗi khi upload ảnh mới');
          }
        }
        
        // Delete marked images
        if (editFormData.removedImages.length > 0) {
          // Sort in descending order to avoid index shifting issues
          const sortedRemovedIndices = [...editFormData.removedImages].sort((a, b) => b - a);
          
          for (const imageIndex of sortedRemovedIndices) {
            try {
              await productsAPI.deleteProductImage(editingProduct.id, imageIndex);
            } catch (deleteError) {
              console.error('Error deleting image:', deleteError);
              alert(`Có lỗi khi xóa ảnh thứ ${imageIndex + 1}`);
            }
          }
        }
      }
      
      // Refresh product data
      const refreshedProduct = await productsAPI.getProduct(editingProduct.id);
      setProducts(products.map(p => p.id === editingProduct.id ? refreshedProduct : p));
      setEditingProduct(null);
      resetEditForm();
      showToast({
        type: 'success',
        title: 'Cập nhật sản phẩm thành công!',
        message: `${productData.name} đã được cập nhật thành công.`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error updating product:', error);
      showToast({
        type: 'error',
        title: 'Lỗi cập nhật sản phẩm',
        message: 'Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.',
        duration: 4000
      });
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      brand: formData.brand,
      category_id: parseInt(formData.category_id),
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
      size: formData.size,
      condition: formData.condition,
      status: formData.status,
      description: formData.description,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      images: [], // Empty array for now, will be uploaded separately
      is_featured: formData.is_featured
    };

    try {
      // Create product first
      const newProduct = await productsAPI.createProduct(productData);
      
      // Upload images if any
      if (formData.images.length > 0) {
        const imageFormData = new FormData();
        formData.images.forEach((file) => {
          imageFormData.append('files', file);
        });
        
        try {
          await productsAPI.uploadProductImages(newProduct.id, imageFormData);
        } catch (imageError) {
          console.error('Error uploading images:', imageError);
          alert('Tạo sản phẩm thành công nhưng có lỗi khi upload ảnh');
        }
      }
      
      // Refresh products list
      await loadData();
      setShowAddModal(false);
      resetForm();
      showToast({
        type: 'success',
        title: 'Tạo sản phẩm thành công!',
        message: `${productData.name} đã được tạo thành công.`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error creating product:', error);
      showToast({
        type: 'error',
        title: 'Lỗi tạo sản phẩm',
        message: 'Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.',
        duration: 4000
      });
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    try {
      switch (action) {
        case 'delete':
          if (confirm(`Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm?`)) {
            await Promise.all(selectedProducts.map(id => productsAPI.deleteProduct(id)));
            setProducts(products.filter(p => !selectedProducts.includes(p.id)));
            setSelectedProducts([]);
          }
          break;
        case 'available':
          await Promise.all(selectedProducts.map(id => 
            productsAPI.updateProduct(id, { status: 'available' })
          ));
          setProducts(products.map(p => 
            selectedProducts.includes(p.id) ? { ...p, status: 'available' } : p
          ));
          setSelectedProducts([]);
          break;
        case 'sold':
          await Promise.all(selectedProducts.map(id => 
            productsAPI.updateProduct(id, { status: 'sold' })
          ));
          setProducts(products.map(p => 
            selectedProducts.includes(p.id) ? { ...p, status: 'sold' } : p
          ));
          setSelectedProducts([]);
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
            <h1 className="text-2xl font-bold text-primary-900 mb-2">Quản lý sản phẩm</h1>
            <p className="text-primary-600">Quản lý kho hàng và sản phẩm</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              Xuất Excel
            </button>
            <QuickAddProduct 
              onProductAdded={loadData}
              buttonText="Thêm sản phẩm"
              buttonIcon={<Plus className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">{products.length}</p>
            <p className="text-primary-600">Tổng sản phẩm</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">
              {products.filter(p => p.status === 'available').length}
            </p>
            <p className="text-primary-600">Có sẵn</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">
              {products.filter(p => p.status === 'sold').length}
            </p>
            <p className="text-primary-600">Đã bán</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-accent-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">
              {formatPrice(products.reduce((sum, p) => sum + p.price, 0))}
            </p>
            <p className="text-primary-600">Tổng giá trị</p>
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
              placeholder="Tìm tên sản phẩm, thương hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="Tất cả">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="available">Có sẵn</option>
              <option value="reserved">Đã giữ</option>
              <option value="sold">Đã bán</option>
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-accent-100 text-accent-600' : 'text-primary-600 hover:bg-primary-100'
                }`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-accent-100 text-accent-600' : 'text-primary-600 hover:bg-primary-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-4 bg-accent-50 rounded-xl border border-accent-200">
            <div className="flex items-center justify-between">
              <span className="text-accent-800 font-medium">
                Đã chọn {selectedProducts.length} sản phẩm
              </span>
              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-1 border border-accent-300 rounded-lg text-sm"
                  onChange={(e) => handleBulkAction(e.target.value)}
                >
                  <option>Chọn hành động</option>
                  <option value="available">Đánh dấu có sẵn</option>
                  <option value="sold">Đánh dấu đã bán</option>
                  <option value="delete">Xóa</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const statusInfo = getStatusInfo(product.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={product.id} className="bg-white rounded-2xl shadow-vintage overflow-hidden hover:shadow-xl transition-shadow">
                {/* Product Image */}
                <div className="relative">
                  <div className="h-48 bg-primary-200 overflow-hidden">
                    {(() => {
                      const imageUrl = product.images && product.images.length > 0 
                        ? getImageUrl(product.images[0], 'products') 
                        : null;
                      return imageUrl && isValidUrl(imageUrl) ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-16 w-16 text-primary-400" />
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>

                  {/* Checkbox */}
                  <div className="absolute top-4 right-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-white text-accent-500 focus:ring-accent-500 bg-white/80"
                    />
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-primary-900 line-clamp-2 mb-2">{product.name}</h3>
                    <p className="text-sm text-primary-600 mb-2">{product.brand} • {product.size}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-accent-600">{formatPrice(product.price)}</span>
                      {product.original_price && (
                        <span className="text-sm text-primary-500 line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          resetEditForm();
                        }}
                        className="p-2 text-primary-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => window.open(`/products/${product.id}`, '_blank')}
                        className="p-2 text-primary-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-primary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-vintage overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50 border-b border-primary-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-primary-300 text-accent-500 focus:ring-accent-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Thương hiệu
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-primary-500 uppercase tracking-wider">
                    Trạng thái
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
                {filteredProducts.map((product) => {
                  const statusInfo = getStatusInfo(product.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={product.id} className="hover:bg-primary-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-primary-300 text-accent-500 focus:ring-accent-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                            {(() => {
                              const imageUrl = product.images && product.images.length > 0 
                                ? getImageUrl(product.images[0], 'products') 
                                : null;
                              return imageUrl && isValidUrl(imageUrl) ? (
                                <Image
                                  src={imageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="h-6 w-6 text-primary-400" />
                                </div>
                              );
                            })()}
                          </div>
                          <div>
                            <p className="font-semibold text-primary-900">{product.name}</p>
                            <p className="text-sm text-primary-600">{product.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-primary-800">{product.brand}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-accent-600">{formatPrice(product.price)}</p>
                          {product.original_price && (
                            <p className="text-sm text-primary-500 line-through">
                              {formatPrice(product.original_price)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-primary-600">
                          {new Date(product.created_at).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingProduct(product);
                              resetEditForm();
                            }}
                            className="p-2 text-primary-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => window.open(`/products/${product.id}`, '_blank')}
                            className="p-2 text-primary-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-primary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <Package className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-800 mb-2">
            Không tìm thấy sản phẩm
          </h3>
          <p className="text-primary-600 mb-6">
            Thử thay đổi bộ lọc hoặc tạo sản phẩm mới
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Thêm sản phẩm đầu tiên
          </button>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-primary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary-900">Sửa sản phẩm</h2>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    resetEditForm();
                  }}
                  className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleEditProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      defaultValue={editingProduct.name}
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Thương hiệu *
                    </label>
                    <input
                      type="text"
                      defaultValue={editingProduct.brand}
                      name="brand"
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="Nhập thương hiệu"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Danh mục *
                    </label>
                    <select
                      name="category_id"
                      defaultValue={editingProduct.category_id}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Giá bán (VNĐ) *
                    </label>
                    <input
                      type="number"
                      defaultValue={editingProduct.price}
                      name="price"
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Giá gốc (VNĐ)
                    </label>
                    <input
                      type="number"
                      defaultValue={editingProduct.original_price || ''}
                      name="original_price"
                      min="0"
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Kích thước *
                    </label>
                    <select
                      name="size"
                      defaultValue={editingProduct.size}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    >
                      <option value="">Chọn kích thước</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="Free Size">Free Size</option>
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Tình trạng *
                    </label>
                    <select
                      name="condition"
                      defaultValue={editingProduct.condition}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    >
                      <option value="">Chọn tình trạng</option>
                      <option value="new">Mới</option>
                      <option value="like_new">Như mới</option>
                      <option value="good">Tốt</option>
                      <option value="fair">Khá</option>
                      <option value="poor">Cũ</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Trạng thái *
                    </label>
                    <select
                      name="status"
                      defaultValue={editingProduct.status}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    >
                      <option value="available">Có sẵn</option>
                      <option value="reserved">Đã đặt</option>
                      <option value="sold">Đã bán</option>
                    </select>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      defaultChecked={editingProduct.is_featured}
                      className="w-4 h-4 text-accent-600 bg-primary-100 border-primary-300 rounded focus:ring-accent-500"
                    />
                    <label className="ml-2 text-sm font-medium text-primary-700">
                      Sản phẩm nổi bật
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct.description || ''}
                    rows={4}
                    className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Tags (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    defaultValue={editingProduct.tags?.join(', ') || ''}
                    name="tags"
                    className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    placeholder="vintage, y2k, streetwear"
                  />
                </div>

                {/* Current Images */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Ảnh hiện tại (kéo để sắp xếp, click X để xóa)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {editingProduct.images.map((image, index) => {
                        const imageUrl = getImageUrl(image, 'products');
                        const isMarkedForRemoval = editFormData.removedImages.includes(index);
                        const isDragging = draggedIndex === index;
                        return imageUrl && isValidUrl(imageUrl) ? (
                          <div 
                            key={index} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`relative w-full h-32 border-2 rounded-lg overflow-hidden cursor-move transition-all ${
                              isMarkedForRemoval 
                                ? 'border-red-500 opacity-50' 
                                : isDragging
                                ? 'border-blue-500 opacity-75 scale-105'
                                : 'border-gray-300 hover:border-blue-400 hover:shadow-lg'
                            }`}
                          >
                            <Image
                              src={imageUrl}
                              alt={`${editingProduct.name} - ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {isMarkedForRemoval && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">Đã xóa</span>
                              </div>
                            )}
                            {/* Drag handle indicator */}
                            <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center opacity-75">
                              <span className="text-xs font-bold">⋮⋮</span>
                            </div>
                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => markImageForRemoval(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                            {/* Image order number */}
                            <div className="absolute bottom-2 left-2 w-6 h-6 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Kéo thả ảnh để sắp xếp thứ tự hiển thị. Ảnh đầu tiên sẽ là ảnh chính của sản phẩm.
                    </p>
                  </div>
                )}

                {/* Upload New Images */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Thêm ảnh mới (có thể chọn nhiều ảnh)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEditImageUpload}
                    className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                  />
                  
                  {/* New Image Previews */}
                  {editFormData.newImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Ảnh mới sẽ thêm:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {editFormData.newImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden">
                              <Image
                                src={URL.createObjectURL(image)}
                                alt={`New image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-primary-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      resetEditForm();
                    }}
                    className="px-6 py-3 text-primary-600 hover:text-primary-800 font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Cập nhật sản phẩm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-primary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary-900">Thêm sản phẩm mới</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Thương hiệu *
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="Nhập thương hiệu"
                    />
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Kích thước *
                    </label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    >
                      <option value="">Chọn kích thước</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="Free Size">Free Size</option>
                    </select>
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Tình trạng *
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    >
                      <option value="">Chọn tình trạng</option>
                      <option value="new">Mới</option>
                      <option value="like_new">Như mới</option>
                      <option value="good">Tốt</option>
                      <option value="fair">Khá</option>
                      <option value="poor">Cũ</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Giá bán *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="Nhập giá bán"
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Giá gốc
                    </label>
                    <input
                      type="number"
                      value={formData.original_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="Nhập giá gốc"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Danh mục *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Trạng thái *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    >
                      <option value="available">Có sẵn</option>
                      <option value="reserved">Đã đặt</option>
                      <option value="sold">Đã bán</option>
                    </select>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="w-4 h-4 text-accent-600 bg-primary-100 border-primary-300 rounded focus:ring-accent-500"
                    />
                    <label className="ml-2 text-sm font-medium text-primary-700">
                      Sản phẩm nổi bật
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Tags (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                    placeholder="vintage, y2k, streetwear"
                  />
                </div>

                {/* Multiple Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Hình ảnh sản phẩm (có thể chọn nhiều ảnh)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                  />
                  
                  {/* Image Previews */}
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Ảnh đã chọn:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="relative w-full h-32 border border-gray-300 rounded-lg overflow-hidden">
                              <Image
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-primary-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 text-primary-600 hover:text-primary-800 font-medium transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Thêm sản phẩm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-primary-900 text-center mb-2">
                Xác nhận xóa sản phẩm
              </h3>
              
              <p className="text-primary-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deletingProduct.name}"</strong>? 
                Hành động này không thể hoàn tác.
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="px-6 py-3 text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDeleteProduct}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                >
                  Xóa sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}