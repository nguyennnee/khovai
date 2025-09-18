'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Eye, Heart, MessageCircle, Search, Filter, ArrowRight, Star, Sun } from 'lucide-react';
import { blogAPI, BlogPost, getImageUrl } from '@/lib/services/api';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [categories, setCategories] = useState<string[]>(['Tất cả']);

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
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setIsLoading(true);
      const [postsData, featuredData, categoriesData] = await Promise.all([
        blogAPI.getBlogPosts({ limit: 20 }),
        blogAPI.getFeaturedPosts(3),
        blogAPI.getBlogCategories()
      ]);
      setPosts(postsData);
      setFeaturedPosts(featuredData);
      setCategories(['Tất cả', ...categoriesData]);
    } catch (error) {
      console.error('Failed to fetch blog data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Style Guide':
        return 'bg-purple-100 text-purple-800';
      case 'Lookbook':
        return 'bg-pink-100 text-pink-800';
      case 'Care Tips':
        return 'bg-blue-100 text-blue-800';
      case 'Sustainability':
        return 'bg-green-100 text-green-800';
      case 'News':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vintage-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-vintage overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sun className="h-5 w-5 text-accent-300" />
              <span className="text-sm font-medium">Blog & Lookbook</span>
            </div>
            
            <h1 className="font-display text-5xl lg:text-6xl font-bold mb-6">
              Blog & Lookbook
            </h1>
            
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Khám phá những xu hướng thời trang mới nhất, tips phối đồ và câu chuyện đằng sau những món đồ thrift độc đáo
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-6 w-6 text-accent-500" />
              <h2 className="font-display text-3xl font-bold text-primary-900">
                Bài viết nổi bật
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <article key={post.id} className={`group bg-white rounded-2xl shadow-vintage overflow-hidden hover:shadow-xl transition-all duration-300 ${index === 0 ? 'lg:col-span-2' : ''}`}>
                  <div className={`relative overflow-hidden ${index === 0 ? 'h-80' : 'h-48'}`}>
                    {(() => {
                      const imageUrl = getImageUrl(post.featured_image);
                      return imageUrl && isValidUrl(imageUrl) ? (
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                          <Sun className="h-16 w-16 text-primary-400" />
                        </div>
                      );
                    })()}
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                    
                    {index === 0 && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Featured
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className={`font-display font-bold text-primary-900 mb-3 group-hover:text-accent-600 transition-colors ${index === 0 ? 'text-2xl' : 'text-xl'} line-clamp-2`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-primary-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-primary-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-primary-500">
                        <User className="h-4 w-4" />
                        <span>{post.author || 'Admin'}</span>
                        <Calendar className="h-4 w-4 ml-2" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      
                      <Link 
                        href={`/blog/${post.slug || post.id}`}
                        className="text-accent-600 hover:text-accent-700 font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Đọc thêm <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-vintage p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-primary-900">
              Tất cả bài viết
            </h2>
            <div className="text-primary-600">
              {filteredPosts.length} bài viết
            </div>
          </div>
          
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="group bg-white rounded-2xl shadow-vintage overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    {(() => {
                      const imageUrl = getImageUrl(post.featured_image);
                      return imageUrl && isValidUrl(imageUrl) ? (
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-200 to-accent-200 flex items-center justify-center">
                          <Sun className="h-12 w-12 text-primary-400" />
                        </div>
                      );
                    })()}
                    
                    <div className="absolute top-4 left-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-primary-900 mb-3 group-hover:text-accent-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-primary-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Tags */}
                    {(() => {
                      // Handle both string and array tags
                      let tagsArray = [];
                      try {
                        if (typeof post.tags === 'string') {
                          tagsArray = JSON.parse(post.tags);
                        } else if (Array.isArray(post.tags)) {
                          tagsArray = post.tags;
                        }
                      } catch (e) {
                        tagsArray = [];
                      }
                      
                      return tagsArray && tagsArray.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {tagsArray.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {tagsArray.length > 3 && (
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                              +{tagsArray.length - 3}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                    
                    <div className="flex items-center justify-between text-sm text-primary-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-primary-500">
                        <User className="h-4 w-4" />
                        <span>{post.author || 'Admin'}</span>
                        <Calendar className="h-4 w-4 ml-2" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                      
                      <Link 
                        href={`/blog/${post.slug || post.id}`}
                        className="text-accent-600 hover:text-accent-700 font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Đọc thêm <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Sun className="h-16 w-16 text-primary-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary-800 mb-2">
                Không tìm thấy bài viết
              </h3>
              <p className="text-primary-600 mb-6">
                Thử thay đổi từ khóa tìm kiếm hoặc danh mục
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Tất cả');
                }}
                className="btn-primary"
              >
                Xem tất cả bài viết
              </button>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-8 text-center text-white">
          <Sun className="h-12 w-12 mx-auto mb-4 text-accent-200" />
          <h3 className="font-display text-2xl font-bold mb-2">
            Đừng bỏ lỡ những bài viết mới! 📝
          </h3>
          <p className="text-accent-100 mb-6">
            Đăng ký nhận thông báo để luôn cập nhật những xu hướng thời trang mới nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-full text-primary-900 placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-accent-600 font-semibold px-6 py-3 rounded-full hover:bg-vintage-cream transition-colors">
              Đăng ký
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}