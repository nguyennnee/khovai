'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/types';
import { formatPrice, getConditionText } from '@/lib/utils';
import { cartAPI, getImageUrl } from '@/lib/services/api';
import { useToast } from '@/contexts/ToastContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Parse tags and images from JSON strings
  const tags = Array.isArray(product.tags) ? product.tags : 
    (typeof product.tags === 'string' ? JSON.parse(product.tags || '[]') : []);
  const images = Array.isArray(product.images) ? product.images : 
    (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : []);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.status !== 'available' || isLoading) return;

    setIsLoading(true);
    try {
      await cartAPI.addToCart(product.id, 1);
      if (onAddToCart) {
        onAddToCart(product.id);
      }
      // Trigger navbar refresh
      window.dispatchEvent(new Event('storage'));
      // Show success toast
      showToast({
        type: 'success',
        title: 'Đã thêm vào giỏ hàng!',
        message: `${product.name} đã được thêm vào giỏ hàng của bạn.`,
        duration: 3000
      });
    } catch (error: any) {
      // Show specific error message for thrift shop logic
      if (error.response?.status === 400) {
        // Don't log this as error - it's expected behavior for thrift shop
        showToast({
          type: 'warning',
          title: 'Sản phẩm đã có trong giỏ hàng',
          message: 'Shop thrift chỉ có 1 sản phẩm mỗi loại.',
          duration: 4000
        });
      } else {
        // Only log actual errors
        console.error('Failed to add to cart:', error);
        showToast({
          type: 'error',
          title: 'Lỗi thêm vào giỏ hàng',
          message: 'Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.',
          duration: 4000
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === images.length - 1 ? 0 : prev + 1
      );
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

  return (
    <div className="group bg-white rounded-2xl shadow-vintage hover:shadow-xl transition-all duration-500 overflow-hidden hover:scale-[1.02] border border-primary-100">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-vintage-cream">
          {images && images.length > 0 ? (() => {
            const imageUrl = getImageUrl(images[currentImageIndex], 'products');
            return imageUrl && isValidUrl(imageUrl) ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-100 to-vintage-beige flex items-center justify-center">
                <div className="text-center text-primary-400">
                  <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <span className="text-sm">Ảnh đang cập nhật</span>
                </div>
              </div>
            );
          })() : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-vintage-beige flex items-center justify-center">
              <div className="text-center text-primary-400">
                <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <span className="text-sm">Ảnh đang cập nhật</span>
              </div>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

          {/* Image Navigation Dots */}
          {images && images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={nextImage}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2.5 bg-white/90 hover:bg-white rounded-full transition-all duration-300 shadow-vintage hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <Heart 
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'text-accent-500 fill-current' : 'text-primary-600 hover:text-accent-500'
              }`} 
            />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.status === 'available' && (
              <div className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg animate-pulse">
                Còn 1 chiếc!
              </div>
            )}
            {product.is_featured && (
              <div className="bg-accent-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg">
                ⭐ Nổi bật
              </div>
            )}
          </div>

          {/* Quick View Button */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="bg-white/90 hover:bg-white text-primary-800 p-2 rounded-full shadow-vintage hover:scale-110 transition-all duration-300">
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Brand & Category */}
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm text-accent-600 font-semibold uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="text-xs text-primary-600 bg-primary-100 px-3 py-1.5 rounded-full font-medium">
              {getConditionText(product.condition)}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-display text-xl font-bold text-primary-900 mb-2 line-clamp-2 group-hover:text-accent-700 transition-colors">
            {product.name}
          </h3>

          {/* Size & Category */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-primary-600 font-medium">
              Size: <span className="text-primary-800 font-semibold">{product.size}</span>
            </span>
            <span className="text-xs text-primary-500 capitalize">
              {product.category?.name || 'Uncategorized'}
            </span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex justify-between items-center mb-4">
            <span className="font-display text-2xl font-bold text-accent-600">
              {formatPrice(product.price)}
            </span>
            
            {product.status === 'available' ? (
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="bg-accent-500 hover:bg-accent-600 disabled:bg-accent-400 text-white p-3 rounded-xl hover:scale-110 transition-all duration-300 shadow-accent disabled:cursor-not-allowed"
                title="Thêm vào giỏ hàng"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingBag className="h-5 w-5" />
                )}
              </button>
            ) : (
              <span className="text-sm text-red-500 font-semibold bg-red-50 px-3 py-2 rounded-lg">
                Đã bán
              </span>
            )}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.slice(0, 3).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="text-xs bg-vintage-beige hover:bg-primary-200 text-primary-700 px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-primary-500 bg-primary-50 px-3 py-1.5 rounded-full">
                  +{tags.length - 3} tags
                </span>
              )}
            </div>
          )}

          {/* Rating - Placeholder for future */}
          <div className="flex items-center gap-1 mt-3 opacity-50">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-3 w-3 text-primary-300" />
            ))}
            <span className="text-xs text-primary-400 ml-1">(Sắp có đánh giá)</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
