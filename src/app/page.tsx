'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sun, Sparkles, Heart, Recycle, Star, Users, Award, Truck } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import NewsletterSignup from '@/components/NewsletterSignup';
import { productsAPI, getImageUrl } from '@/lib/services/api';
import { Product } from '@/types';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [limitedStockProducts, setLimitedStockProducts] = useState<Product[]>([]);
  const [randomProduct, setRandomProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured products
        const featured = await productsAPI.getFeaturedProducts();
        setFeaturedProducts(featured);
        
        // Fetch all products and filter for limited stock (available products)
        const allProductsResponse = await productsAPI.getProducts({});
        const allProducts = Array.isArray(allProductsResponse) ? allProductsResponse : allProductsResponse.products || [];
        const limitedStock = allProducts.filter((product: Product) => product.status === 'available').slice(0, 4);
        setLimitedStockProducts(limitedStock);
        
        // Get random available product for hero section
        const availableProducts = allProducts.filter((product: Product) => product.status === 'available');
        if (availableProducts.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableProducts.length);
          setRandomProduct(availableProducts[randomIndex]);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to empty array on error
        setFeaturedProducts([]);
        setLimitedStockProducts([]);
        setRandomProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Siêu đẹp */}
      <section className="relative overflow-hidden bg-gradient-to-br from-vintage-cream via-vintage-beige to-primary-200 min-h-screen flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-vintage-texture opacity-30"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-accent-200 rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-32 h-32 bg-primary-300 rounded-full opacity-15"></div>
        </div>
        <div className="absolute top-1/2 right-10 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-16 h-16 bg-accent-300 rounded-full opacity-25"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-vintage">
                <Sun className="h-5 w-5 text-accent-500 animate-bounce-gentle" />
                <span className="text-sm font-medium text-primary-800">Chào mừng đến với</span>
              </div>
              
              <h1 className="font-display text-5xl lg:text-7xl font-bold text-primary-900 mb-6 leading-tight">
                lil.shunshine
                <span className="block text-accent-600">thrift</span>
              </h1>
              
              <p className="text-2xl lg:text-3xl text-primary-700 mb-4 font-light">
                Săn đồ độc - sống xanh - phong cách riêng
              </p>
              
              <p className="text-lg text-primary-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Khám phá những món đồ vintage và thrift độc đáo, mỗi item chỉ có duy nhất 1 chiếc.
                Tạo phong cách riêng và góp phần bảo vệ môi trường! 🌱
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/products" 
                  className="group bg-accent-500 hover:bg-accent-600 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-accent hover:shadow-lg hover:scale-105 inline-flex items-center gap-2"
                >
                  Khám phá ngay 
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/about" 
                  className="group bg-white/90 hover:bg-white text-primary-800 font-semibold text-lg px-8 py-4 rounded-full border-2 border-primary-300 hover:border-primary-400 transition-all duration-300 shadow-vintage hover:shadow-lg hover:scale-105"
                >
                  Câu chuyện của chúng tôi
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-primary-300/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">1000+</div>
                  <div className="text-sm text-primary-600">Sản phẩm độc đáo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">5⭐</div>
                  <div className="text-sm text-primary-600">Đánh giá khách hàng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600">24h</div>
                  <div className="text-sm text-primary-600">Giao hàng nhanh</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative lg:order-last">
              <div className="relative">
                {/* Random Product Display */}
                <Link href={randomProduct ? `/products/${randomProduct.id}` : '#'} className="block">
                  <div className="aspect-square bg-gradient-to-br from-primary-200 to-accent-200 rounded-3xl overflow-hidden shadow-vintage hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  {randomProduct ? (() => {
                    // Parse images from JSON string
                    const images = Array.isArray(randomProduct.images) ? randomProduct.images : 
                      (typeof randomProduct.images === 'string' ? JSON.parse(randomProduct.images || '[]') : []);
                    
                    return (
                      <div className="relative w-full h-full">
                        {images && images.length > 0 ? (() => {
                          const imageUrl = getImageUrl(images[0], 'products');
                          return imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={randomProduct.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center text-primary-700">
                                <Sun className="h-24 w-24 mx-auto mb-4 animate-float" />
                                <p className="text-lg font-medium">{randomProduct.brand}</p>
                                <p className="text-sm opacity-70">{randomProduct.name}</p>
                              </div>
                            </div>
                          );
                        })() : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-primary-700">
                              <Sun className="h-24 w-24 mx-auto mb-4 animate-float" />
                              <p className="text-lg font-medium">{randomProduct.brand}</p>
                              <p className="text-sm opacity-70">{randomProduct.name}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Product Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                          <div className="text-white">
                            <h3 className="text-lg font-bold mb-1 line-clamp-2">{randomProduct.name}</h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm opacity-80">Size {randomProduct.size}</span>
                                <span className="text-sm opacity-80">•</span>
                                <span className="text-sm opacity-80">{randomProduct.condition}% new</span>
                              </div>
                              <div className="text-right">
                                {randomProduct.original_price && randomProduct.original_price > randomProduct.price && (
                                  <div className="text-xs opacity-60 line-through">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(randomProduct.original_price)}
                                  </div>
                                )}
                                <div className="text-lg font-bold text-accent-300">
                                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(randomProduct.price)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })() : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-primary-700">
                      <Sun className="h-24 w-24 mx-auto mb-4 animate-float" />
                      <p className="text-lg font-medium">Vintage Fashion</p>
                      <p className="text-sm opacity-70">Coming Soon</p>
                    </div>
                  </div>
                  )}
                </div>
                </Link>
                
                {/* Floating Cards */}
                {randomProduct && (
                <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-vintage animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-primary-800">Còn 1 chiếc!</span>
                  </div>
                </div>
                )}
                
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-vintage animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-accent-500" />
                    <span className="text-sm font-medium text-primary-800">Được yêu thích</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-vintage-texture opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-primary-900 mb-4">
              Tại sao chọn lil.shunshine.thrift?
            </h2>
            <p className="text-xl text-primary-600 max-w-3xl mx-auto">
              Chúng tôi không chỉ bán đồ cũ, chúng tôi tạo ra những câu chuyện thời trang bền vững
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 hover:shadow-accent transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-primary-900 mb-3">
                Độc đáo & Hiếm có
              </h3>
              <p className="text-primary-600 leading-relaxed">
                Mỗi sản phẩm chỉ có duy nhất 1 chiếc. Tạo phong cách riêng biệt không đụng hàng.
              </p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 hover:shadow-vintage transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Recycle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-primary-900 mb-3">
                Bền vững & Xanh
              </h3>
              <p className="text-primary-600 leading-relaxed">
                Mua đồ thrift = giảm lãng phí + bảo vệ môi trường. Fashion với trách nhiệm.
              </p>
            </div>
            
            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 hover:shadow-accent transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-primary-900 mb-3">
                Chất lượng & Tâm huyết
              </h3>
              <p className="text-primary-600 leading-relaxed">
                Tỉ mỉ tuyển chọn, kiểm tra kỹ lưỡng. Mỗi item đều có story riêng.
              </p>
            </div>

            <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 hover:shadow-vintage transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold text-primary-900 mb-3">
                Uy tín & Chất lượng
              </h3>
              <p className="text-primary-600 leading-relaxed">
                Đội ngũ chuyên nghiệp, dịch vụ tận tâm, cam kết chất lượng 100%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-vintage-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-vintage-texture opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-display text-4xl font-bold text-primary-900 mb-2">
                Sản phẩm nổi bật
              </h2>
              <p className="text-xl text-primary-600">
                Những món đồ được yêu thích nhất trong tuần
              </p>
            </div>
            <Link 
              href="/products" 
              className="group text-accent-600 hover:text-accent-700 font-semibold inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-vintage hover:shadow-lg transition-all duration-300"
            >
              Xem tất cả 
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
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
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Sun className="h-16 w-16 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-800 mb-2">
                Sản phẩm đang được cập nhật
              </h3>
              <p className="text-primary-600">
                Hãy quay lại sau để khám phá những món đồ thrift tuyệt vời!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Only 1 Left Section */}
      <section className="py-20 bg-gradient-to-br from-accent-50 to-accent-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-vintage-texture opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-accent-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-medium text-accent-700">⚡ Limited Stock</span>
            </div>
            <h2 className="font-display text-4xl font-bold text-primary-900 mb-4">
              Only 1 Left! 🔥
            </h2>
            <p className="text-xl text-primary-600">
              Những món đồ chỉ còn 1 chiếc duy nhất - nhanh tay kẻo hết!
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-vintage overflow-hidden animate-pulse">
                  <div className="aspect-[3/4] bg-primary-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-primary-200 rounded mb-3"></div>
                    <div className="h-6 bg-primary-200 rounded mb-3"></div>
                    <div className="h-4 bg-primary-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : limitedStockProducts.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {limitedStockProducts.map((product) => {
                // Parse images from JSON string
                const images = Array.isArray(product.images) ? product.images : 
                  (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : []);
                
                return (
                <div key={product.id} className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-vintage overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative aspect-[3/4] overflow-hidden">
                      {images && images.length > 0 ? (() => {
                        const imageUrl = getImageUrl(images[0], 'products');
                        return imageUrl ? (
                      <Image
                            src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 320px"
                      />
                    ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                            <Sun className="h-16 w-16 text-primary-400" />
                          </div>
                        );
                      })() : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                        <Sun className="h-16 w-16 text-primary-400" />
                      </div>
                    )}
                    
                    {/* Only 1 Left Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                        Only 1 Left!
                      </div>
                    </div>
                    
                    {/* Brand Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-primary-800">
                        {product.brand}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-primary-900 mb-2 line-clamp-2 group-hover:text-accent-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-primary-500">Size {product.size}</span>
                      <span className="text-sm text-primary-500">•</span>
                      <span className="text-sm text-primary-500">{product.condition}% new</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-primary-400 line-through">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.original_price)}
                          </span>
                        )}
                        <span className="text-lg font-bold text-accent-600">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                      </div>
                      
                      <Link 
                        href={`/products/${product.id}`}
                        className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Xem ngay
                      </Link>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Sun className="h-16 w-16 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-800 mb-2">
                Sản phẩm đang được cập nhật
              </h3>
              <p className="text-primary-600">
                Hãy quay lại sau để khám phá những món đồ thrift tuyệt vời!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-primary-900 mb-4">
              Khám phá theo phong cách
            </h2>
            <p className="text-xl text-primary-600">
              Từ vintage cổ điển đến streetwear hiện đại
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link 
              href="/categories/vintage" 
              className="group relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl overflow-hidden h-80 hover:shadow-vintage transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-vintage-texture opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <h3 className="font-display text-3xl font-bold mb-2 group-hover:text-accent-200 transition-colors">
                  Vintage
                </h3>
                <p className="text-primary-100 mb-4">
                  Phong cách cổ điển, timeless elegance
                </p>
                <div className="flex items-center gap-2 text-accent-200 font-medium">
                  Khám phá <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link 
              href="/categories/y2k" 
              className="group relative bg-gradient-to-br from-accent-500 to-accent-700 rounded-3xl overflow-hidden h-80 hover:shadow-accent transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-vintage-texture opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <h3 className="font-display text-3xl font-bold mb-2 group-hover:text-primary-200 transition-colors">
                  Y2K
                </h3>
                <p className="text-accent-100 mb-4">
                  Nostalgic 2000s vibes, bold & colorful
                </p>
                <div className="flex items-center gap-2 text-primary-200 font-medium">
                  Khám phá <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link 
              href="/categories/streetwear" 
              className="group relative bg-gradient-to-br from-primary-800 to-black rounded-3xl overflow-hidden h-80 hover:shadow-vintage transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-vintage-texture opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-8 text-white">
                <h3 className="font-display text-3xl font-bold mb-2 group-hover:text-accent-200 transition-colors">
                  Streetwear
                </h3>
                <p className="text-primary-100 mb-4">
                  Urban style, trendy & comfortable
                </p>
                <div className="flex items-center gap-2 text-accent-200 font-medium">
                  Khám phá <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSignup />

      {/* Trust Indicators */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-accent-400 mb-2" />
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-primary-300">Khách hàng hài lòng</div>
            </div>
            <div className="flex flex-col items-center">
              <Star className="h-8 w-8 text-accent-400 mb-2" />
              <div className="text-2xl font-bold">4.9</div>
              <div className="text-sm text-primary-300">Đánh giá trung bình</div>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-8 w-8 text-accent-400 mb-2" />
              <div className="text-2xl font-bold">24h</div>
              <div className="text-sm text-primary-300">Giao hàng nhanh</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-accent-400 mb-2" />
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-primary-300">Cam kết chất lượng</div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}