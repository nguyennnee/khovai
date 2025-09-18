'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { productsAPI, Category } from '@/lib/services/api';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';

interface QuickAddProductProps {
  onProductAdded?: () => void;
  className?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
}

export default function QuickAddProduct({ 
  onProductAdded, 
  className = "",
  buttonText = "Thêm sản phẩm nhanh",
  buttonIcon = <Plus className="h-4 w-4" />
}: QuickAddProductProps) {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
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

  // Load categories when modal opens
  useEffect(() => {
    if (showModal) {
      loadCategories();
    }
  }, [showModal]);

  const loadCategories = async () => {
    try {
      const categoriesData = await productsAPI.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
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

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check authentication and admin role
    if (!isAuthenticated || user?.role !== 'admin') {
      showToast({
        type: 'error',
        title: 'Không có quyền',
        message: 'Bạn cần đăng nhập với tài khoản admin để thêm sản phẩm.',
        duration: 4000
      });
      return;
    }
    
    // Validate required fields
    if (!formData.name.trim() || !formData.brand.trim() || !formData.size || !formData.condition || !formData.price || !formData.category_id) {
      showToast({
        type: 'error',
        title: 'Thiếu thông tin',
        message: 'Vui lòng điền đầy đủ các trường bắt buộc.',
        duration: 4000
      });
      return;
    }
    
    // Validate numeric fields
    const price = parseFloat(formData.price);
    const categoryId = parseInt(formData.category_id);
    
    if (isNaN(price) || price <= 0) {
      showToast({
        type: 'error',
        title: 'Giá không hợp lệ',
        message: 'Vui lòng nhập giá bán hợp lệ.',
        duration: 4000
      });
      return;
    }
    
    if (isNaN(categoryId) || categoryId <= 0) {
      showToast({
        type: 'error',
        title: 'Danh mục không hợp lệ',
        message: 'Vui lòng chọn danh mục hợp lệ.',
        duration: 4000
      });
      return;
    }
    
    // Validate original price if provided
    let originalPrice = undefined;
    if (formData.original_price && formData.original_price.trim()) {
      originalPrice = parseFloat(formData.original_price);
      if (isNaN(originalPrice) || originalPrice <= 0) {
        showToast({
          type: 'error',
          title: 'Giá gốc không hợp lệ',
          message: 'Vui lòng nhập giá gốc hợp lệ hoặc để trống.',
          duration: 4000
        });
        return;
      }
    }
    
    setLoading(true);
    
    const productData: any = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      category_id: categoryId,
      price: price,
      size: formData.size,
      condition: formData.condition,
      status: formData.status,
      is_featured: formData.is_featured
    };
    
    // Only add optional fields if they have values
    if (originalPrice !== undefined) {
      productData.original_price = originalPrice;
    }
    
    if (formData.description && formData.description.trim()) {
      productData.description = formData.description.trim();
    }
    
    if (formData.tags && formData.tags.trim()) {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tags.length > 0) {
        productData.tags = tags;
      }
    }

    try {
      // Log the data being sent
      console.log('Creating product with data:', productData);
      console.log('JSON stringified:', JSON.stringify(productData, null, 2));
      
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
          showToast({
            type: 'warning',
            title: 'Tạo sản phẩm thành công',
            message: 'Sản phẩm đã được tạo nhưng có lỗi khi upload ảnh. Bạn có thể thêm ảnh sau.',
            duration: 4000
          });
        }
      }
      
      // Close modal and reset form
      setShowModal(false);
      resetForm();
      
      // Show success message
      showToast({
        type: 'success',
        title: 'Tạo sản phẩm thành công!',
        message: `${productData.name} đã được tạo thành công.`,
        duration: 3000
      });

      // Callback to refresh parent component
      if (onProductAdded) {
        onProductAdded();
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      
      // Get detailed error message
      let errorMessage = 'Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.';
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map((err: any) => err.msg || err).join(', ');
        }
      }
      
      showToast({
        type: 'error',
        title: 'Lỗi tạo sản phẩm',
        message: errorMessage,
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Quick Add Button */}
      <button 
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-accent-500 text-white hover:bg-accent-600 rounded-lg transition-colors ${className}`}
      >
        {buttonIcon}
        {buttonText}
      </button>

      {/* Quick Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-primary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary-900">Thêm sản phẩm nhanh</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
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
                      Giá bán (VNĐ) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-primary-300 rounded-xl focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      placeholder="Nhập giá bán"
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">
                      Giá gốc (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={formData.original_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                      min="0"
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
                    rows={3}
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
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 text-primary-600 hover:text-primary-800 font-medium transition-colors"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Thêm sản phẩm
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
