'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Shield, 
  Truck, 
  RotateCcw, 
  Zap,
  Share2,
  Eye
} from 'lucide-react';
import { Product } from '@/types';
import { productsAPI, cartAPI, getImageUrl } from '@/lib/services/api';
import { formatPrice, getConditionText } from '@/lib/utils';
import { useToast } from '@/contexts/ToastContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [holdTimeLeft, setHoldTimeLeft] = useState(0); // seconds
  const [isHolding, setIsHolding] = useState(false);

  // Parse images and tags
  const images = product?.images ? 
    (Array.isArray(product.images) ? product.images : JSON.parse(product.images || '[]')) : [];
  const tags = product?.tags ? 
    (Array.isArray(product.tags) ? product.tags : JSON.parse(product.tags || '[]')) : [];

  // Helper function to validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetail();
      fetchSuggestedProducts();
    }
  }, [productId]);

  // Countdown timer for hold
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHolding && holdTimeLeft > 0) {
      interval = setInterval(() => {
        setHoldTimeLeft(prev => {
          if (prev <= 1) {
            setIsHolding(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isHolding, holdTimeLeft]);

  const fetchProductDetail = async () => {
    try {
      setIsLoading(true);
      const productData = await productsAPI.getProduct(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      router.push('/products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedProducts = async () => {
    try {
      const response = await productsAPI.getProducts({ per_page: 4 });
      // API returns array directly, not {products: array}
      setSuggestedProducts(response.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Failed to fetch suggested products:', error);
    }
  };

  const handleHoldProduct = () => {
    setIsHolding(true);
    setHoldTimeLeft(600); // 10 minutes = 600 seconds
  };

  const handleAddToCart = async () => {
    if (!product?.is_available || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await cartAPI.addToCart(product.id);
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
          message: 'Có lỗi xảy ra. Vui lòng thử lại.',
          duration: 4000
        });
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vintage-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-200 border-t-accent-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-vintage-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-800 mb-4">Không tìm thấy sản phẩm</h1>
          <Link href="/products" className="btn-primary">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm text-primary-600">
            <Link href="/" className="hover:text-accent-500 transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-accent-500 transition-colors">Sản phẩm</Link>
            <span>/</span>
            <span className="text-primary-800 font-medium">{product.name}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-vintage">
              {(() => {
                const imageUrl = images.length > 0 ? getImageUrl(images[currentImageIndex], 'products') : null;
                return imageUrl && isValidUrl(imageUrl) ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100">
                    <Eye className="h-24 w-24 text-primary-300" />
                  </div>
                );
              })()}

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-vintage transition-all duration-300 hover:scale-110"
                  >
                    <ArrowLeft className="h-5 w-5 text-primary-800" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow-vintage transition-all duration-300 hover:scale-110"
                  >
                    <ArrowRight className="h-5 w-5 text-primary-800" />
                  </button>
                </>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-vintage transition-all duration-300 hover:scale-110"
              >
                <Heart className={`h-6 w-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-primary-600'}`} />
              </button>

              {/* Share Button */}
              <button className="absolute top-4 left-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-vintage transition-all duration-300 hover:scale-110">
                <Share2 className="h-6 w-6 text-primary-600" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image: string, index: number) => {
                  const imageUrl = getImageUrl(image, 'products');
                  return imageUrl && isValidUrl(imageUrl) ? (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'border-accent-500 scale-105' 
                          : 'border-primary-200 hover:border-accent-300'
                      }`}
                    >
                      <Image
                        src={imageUrl}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center justify-between">
              <span className="text-accent-500 font-bold text-lg uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {product.category?.name || 'Uncategorized'}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-accent-200 fill-current" />
                ))}
                <span className="text-primary-600 ml-2">(Sắp có đánh giá)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-4xl font-bold text-accent-500">
                  {formatPrice(product.price)}
                </span>
                {/* {product.original_price && (
                  <span className="text-xl text-primary-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )} */}
              </div>
              <p className="text-primary-600">
                Chỉ có duy nhất 1 chiếc - Không bao giờ đụng hàng!
              </p>
            </div>

            {/* Size & Condition */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary-700">Size</label>
                <div className="text-2xl font-bold text-primary-800">{product.size}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary-700">Tình trạng</label>
                <div className="text-lg font-semibold text-accent-600">
                  {getConditionText(product.condition)}
                </div>
              </div>
            </div>

            {/* Hold Timer */}
            {isHolding && (
              <div className="bg-gradient-to-r from-accent-100 to-accent-50 border border-accent-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-accent-600 animate-bounce-gentle" />
                  <div>
                    <p className="font-semibold text-accent-800">Sản phẩm đang được giữ</p>
                    <p className="text-accent-600">
                      Thời gian còn lại: <span className="font-mono text-lg font-bold">{formatCountdown(holdTimeLeft)}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {product.status === 'available' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!isHolding ? (
                    <button
                      onClick={handleHoldProduct}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-200 hover:bg-accent-300 text-accent-800 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-vintage"
                    >
                      <Clock className="h-5 w-5" />
                      Giữ hàng 10 phút
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-500 hover:bg-accent-600 disabled:bg-accent-400 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-accent disabled:cursor-not-allowed col-span-full"
                    >
                      {isAddingToCart ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <ShoppingBag className="h-5 w-5" />
                      )}
                      {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xl font-semibold text-red-600 mb-2">Sản phẩm đã được bán</p>
                  <p className="text-primary-600">Hãy khám phá những sản phẩm tương tự khác</p>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4 border-t border-primary-200 pt-6">
              <h3 className="font-display text-xl font-bold text-primary-900">Chi tiết sản phẩm</h3>
              <div className="prose prose-primary max-w-none">
                <p className="text-primary-700 leading-relaxed">
                  {product.description || 'Sản phẩm vintage/thrift độc đáo với chất lượng được kiểm tra kỹ lưỡng. Mỗi món đồ đều có câu chuyện riêng và phong cách đặc biệt.'}
                </p>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-primary-800">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-vintage-beige text-primary-700 rounded-full text-sm font-medium hover:bg-primary-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-primary-200 pt-6">
              <div className="text-center space-y-2">
                <Shield className="h-8 w-8 text-accent-500 mx-auto" />
                <p className="text-sm font-medium text-primary-800">Chất lượng đảm bảo</p>
              </div>
              <div className="text-center space-y-2">
                <Truck className="h-8 w-8 text-accent-500 mx-auto" />
                <p className="text-sm font-medium text-primary-800">Giao hàng nhanh</p>
              </div>
              <div className="text-center space-y-2">
                <RotateCcw className="h-8 w-8 text-accent-500 mx-auto" />
                <p className="text-sm font-medium text-primary-800">Đổi trả 7 ngày</p>
              </div>
              <div className="text-center space-y-2">
                <Zap className="h-8 w-8 text-accent-500 mx-auto" />
                <p className="text-sm font-medium text-primary-800">Độc quyền 1 chiếc</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mix & Match Suggestions */}
        {suggestedProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-primary-900 mb-4">
                Gợi ý Mix & Match 🌈
              </h2>
              <p className="text-xl text-primary-600">
                Những món đồ phù hợp để phối cùng sản phẩm này
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.slice(0, 4).map((suggestedProduct) => (
                <ProductCard key={suggestedProduct.id} product={suggestedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
