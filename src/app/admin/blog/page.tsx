'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { blogAPI, BlogPost, getImageUrl } from '@/lib/services/api';
import { useToast } from '@/contexts/ToastContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  Calendar,
  User,
  MoreHorizontal,
  Download,
  Heart,
  MessageCircle,
  Share2,
  Camera,
  Tag,
  Clock,
  X,
  Save,
  Upload
} from 'lucide-react';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total_posts: 0,
    published_posts: 0,
    draft_posts: 0,
    total_views: 0,
    total_likes: 0,
    total_comments: 0
  });

  // Form state for creating/editing posts
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    status: 'draft',
    featured_image: null as File | null
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData, statsData] = await Promise.all([
        blogAPI.getBlogPosts({ limit: 100 }),
        blogAPI.getBlogCategories(),
        blogAPI.getBlogStats()
      ]);
      setPosts(postsData);
      setCategories(['Tất cả', ...categoriesData]);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (postId: number, newStatus: string) => {
    try {
      await blogAPI.updateBlogPost(postId, { status: newStatus });
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { ...post, status: newStatus, updated_at: new Date().toISOString() }
            : post
        )
      );
    } catch (error) {
      console.error('Error updating post status:', error);
      showToast({
        type: 'error',
        title: 'Lỗi cập nhật trạng thái',
        message: 'Có lỗi xảy ra khi cập nhật trạng thái bài viết.',
        duration: 4000
      });
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    
    try {
      await blogAPI.deleteBlogPost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      setSelectedPosts(prev => prev.filter(id => id !== postId));
      showToast({
        type: 'success',
        title: 'Xóa bài viết thành công!',
        message: 'Bài viết đã được xóa thành công.',
        duration: 3000
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast({
        type: 'error',
        title: 'Lỗi xóa bài viết',
        message: 'Có lỗi xảy ra khi xóa bài viết.',
        duration: 4000
      });
    }
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
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

  const handleCreatePost = async () => {
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        tags: tagsArray,
        status: formData.status
      };

      const newPost = await blogAPI.createBlogPost(postData);
      
      // Upload featured image if provided
      if (formData.featured_image) {
        await blogAPI.uploadFeaturedImage(newPost.id, formData.featured_image);
      }

      setPosts(prev => [newPost, ...prev]);
      setShowCreateForm(false);
      resetForm();
      showToast({
        type: 'success',
        title: 'Tạo bài viết thành công!',
        message: `${formData.title} đã được tạo thành công.`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error creating post:', error);
      showToast({
        type: 'error',
        title: 'Lỗi tạo bài viết',
        message: 'Có lỗi xảy ra khi tạo bài viết.',
        duration: 4000
      });
    }
  };

  const handleEditPost = async () => {
    if (!editingPost) return;
    
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const postData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        tags: tagsArray,
        status: formData.status
      };

      const updatedPost = await blogAPI.updateBlogPost(editingPost.id, postData);
      
      // Upload featured image if provided
      if (formData.featured_image) {
        await blogAPI.uploadFeaturedImage(updatedPost.id, formData.featured_image);
      }

      setPosts(prev => prev.map(p => p.id === editingPost.id ? updatedPost : p));
      setEditingPost(null);
      resetForm();
      showToast({
        type: 'success',
        title: 'Cập nhật bài viết thành công!',
        message: `${formData.title} đã được cập nhật thành công.`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error updating post:', error);
      showToast({
        type: 'error',
        title: 'Lỗi cập nhật bài viết',
        message: 'Có lỗi xảy ra khi cập nhật bài viết.',
        duration: 4000
      });
    }
  };

  const startEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
      status: post.status,
      featured_image: null
    });
  };

  const handleBulkAction = async (action: string) => {
    if (selectedPosts.length === 0) {
      showToast({
        type: 'warning',
        title: 'Chưa chọn bài viết',
        message: 'Vui lòng chọn ít nhất một bài viết.',
        duration: 3000
      });
      return;
    }

    try {
      switch (action) {
        case 'publish':
          await Promise.all(selectedPosts.map(id => 
            blogAPI.updateBlogPost(id, { status: 'published' })
          ));
          setPosts(prev => prev.map(p =>
            selectedPosts.includes(p.id) ? { ...p, status: 'published' } : p
          ));
          setSelectedPosts([]);
          break;
        case 'draft':
          await Promise.all(selectedPosts.map(id => 
            blogAPI.updateBlogPost(id, { status: 'draft' })
          ));
          setPosts(prev => prev.map(p =>
            selectedPosts.includes(p.id) ? { ...p, status: 'draft' } : p
          ));
          setSelectedPosts([]);
          break;
        case 'delete':
          if (confirm(`Bạn có chắc chắn muốn xóa ${selectedPosts.length} bài viết?`)) {
            await Promise.all(selectedPosts.map(id => blogAPI.deleteBlogPost(id)));
            setPosts(prev => prev.filter(p => !selectedPosts.includes(p.id)));
            setSelectedPosts([]);
          }
          break;
      }
    } catch (error) {
      console.error('Error in bulk action:', error);
      showToast({
        type: 'error',
        title: 'Lỗi thực hiện hành động',
        message: 'Có lỗi xảy ra khi thực hiện hành động.',
        duration: 4000
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      status: 'draft',
      featured_image: null
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tất cả' || post.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Tất cả' || post.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Chưa xuất bản';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'published':
        return { 
          text: 'Đã xuất bản', 
          color: 'text-green-600', 
          bg: 'bg-green-50 border-green-200' 
        };
      case 'draft':
        return { 
          text: 'Bản nháp', 
          color: 'text-gray-600', 
          bg: 'bg-gray-50 border-gray-200' 
        };
      case 'scheduled':
        return { 
          text: 'Đã lên lịch', 
          color: 'text-blue-600', 
          bg: 'bg-blue-50 border-blue-200' 
        };
      default:
        return { 
          text: 'Không xác định', 
          color: 'text-gray-600', 
          bg: 'bg-gray-50 border-gray-200' 
        };
    }
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

  const handleSelectPost = (postId: number) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(filteredPosts.map(p => p.id));
    }
  };

  const showPostDetails = (post: BlogPost) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg border">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
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
            <h1 className="text-2xl font-bold text-primary-900 mb-2">Blog & Lookbook</h1>
            <p className="text-primary-600">Quản lý nội dung blog và lookbook</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              Xuất Excel
            </button>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white hover:bg-accent-600 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Viết bài mới
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">{stats.total_posts}</p>
            <p className="text-primary-600">Tổng bài viết</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">{stats.published_posts}</p>
            <p className="text-primary-600">Đã xuất bản</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">{stats.draft_posts}</p>
            <p className="text-primary-600">Bản nháp</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-vintage p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-accent-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary-900">
              {stats.total_views.toLocaleString()}
            </p>
            <p className="text-primary-600">Tổng lượt xem</p>
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
              placeholder="Tìm tiêu đề, nội dung, tags..."
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="scheduled">Đã lên lịch</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="mt-4 p-4 bg-accent-50 rounded-xl border border-accent-200">
            <div className="flex items-center justify-between">
              <span className="text-accent-800 font-medium">
                Đã chọn {selectedPosts.length} bài viết
              </span>
              <div className="flex items-center gap-2">
                <select 
                  className="px-3 py-1 border border-accent-300 rounded-lg text-sm"
                  onChange={(e) => handleBulkAction(e.target.value)}
                >
                  <option>Chọn hành động</option>
                  <option value="publish">Xuất bản</option>
                  <option value="draft">Chuyển thành nháp</option>
                  <option value="delete">Xóa</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const statusInfo = getStatusInfo(post.status);
          
          return (
            <div key={post.id} className="bg-white rounded-2xl shadow-vintage overflow-hidden hover:shadow-xl transition-shadow">
              {/* Post Image */}
              <div className="relative">
                <div className="h-48 bg-primary-200 overflow-hidden">
                  {(() => {
                    const imageUrl = getImageUrl(post.featured_image);
                    return imageUrl && isValidUrl(imageUrl) ? (
                      <Image
                        src={imageUrl}
                      alt={post.title}
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

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                </div>

                {/* Checkbox */}
                <div className="absolute bottom-4 left-4">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => handleSelectPost(post.id)}
                    className="rounded border-white text-accent-500 focus:ring-accent-500 bg-white/80"
                  />
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-primary-900 line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-sm text-primary-600 line-clamp-3">{post.excerpt}</p>
                </div>

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
                  
                  return (
                <div className="flex flex-wrap gap-1 mb-4">
                      {tagsArray?.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                      {tagsArray && tagsArray.length > 3 && (
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                          +{tagsArray.length - 3}
                    </span>
                  )}
                </div>
                  );
                })()}

                {/* Stats */}
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

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-primary-500 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.author || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <select
                    value={post.status}
                    onChange={(e) => handleStatusChange(post.id, e.target.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusInfo.bg} ${statusInfo.color} focus:outline-none focus:ring-2 focus:ring-accent-500`}
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="scheduled">Lên lịch</option>
                    <option value="published">Xuất bản</option>
                  </select>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => showPostDetails(post)}
                      className="p-2 text-primary-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => startEditPost(post)}
                      className="p-2 text-primary-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
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

      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-800 mb-2">
            Không tìm thấy bài viết
          </h3>
          <p className="text-primary-600 mb-6">
            Thử thay đổi bộ lọc hoặc tạo bài viết mới
          </p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Viết bài đầu tiên
          </button>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-primary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary-900">
                  Tạo bài viết mới
                </h2>
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="text-primary-600 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề bài viết
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        title: e.target.value,
                        slug: prev.slug || generateSlug(e.target.value)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nhập tiêu đề bài viết..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="url-slug-tu-dong-tao"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL slug sẽ được tự động tạo từ tiêu đề nếu để trống
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả ngắn
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="Mô tả ngắn về bài viết..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="Style Guide">Style Guide</option>
                      <option value="Lookbook">Lookbook</option>
                      <option value="Care Tips">Care Tips</option>
                      <option value="Sustainability">Sustainability</option>
                      <option value="News">News</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Vintage, Style, Fashion..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="draft">Bản nháp</option>
                      <option value="published">Xuất bản ngay</option>
                      <option value="scheduled">Lên lịch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ảnh đại diện
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        featured_image: e.target.files?.[0] || null 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {formData.featured_image && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="relative w-32 h-24 border border-gray-300 rounded-lg overflow-hidden">
                          <Image
                            src={URL.createObjectURL(formData.featured_image)}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung bài viết
                  </label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    {/* Toolbar */}
                    <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => document.execCommand('bold')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('italic')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 italic"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('underline')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 underline"
                        title="Underline"
                      >
                        U
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => document.execCommand('justifyLeft')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Align Left"
                      >
                        ⬅
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('justifyCenter')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Align Center"
                      >
                        ⬆
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('justifyRight')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Align Right"
                      >
                        ➡
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            document.execCommand('formatBlock', false, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Format"
                      >
                        <option value="">Format</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="p">Paragraph</option>
                      </select>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => document.execCommand('insertUnorderedList')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Bullet List"
                      >
                        •
                      </button>
                      <button
                        type="button"
                        onClick={() => document.execCommand('insertOrderedList')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Numbered List"
                      >
                        1.
                      </button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter URL:');
                          if (url) document.execCommand('createLink', false, url);
                        }}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Insert Link"
                      >
                        🔗
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const color = prompt('Enter color (e.g., #ff0000 or red):');
                          if (color) document.execCommand('foreColor', false, color);
                        }}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                        title="Text Color"
                      >
                        🎨
                      </button>
                    </div>
                    
                    {/* Content Editor */}
                    <div
                      contentEditable
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                      onInput={(e) => {
                        const content = e.currentTarget.innerHTML;
                        setFormData(prev => ({ ...prev, content }));
                      }}
                      className="w-full min-h-[400px] p-3 focus:outline-none"
                      style={{ minHeight: '400px' }}
                    placeholder="Nhập nội dung bài viết..."
                  />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Sử dụng thanh công cụ để định dạng văn bản. Hỗ trợ: in đậm, in nghiêng, gạch chân, căn lề, danh sách, link, màu chữ.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary-200">
                <button 
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleCreatePost}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Tạo bài viết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {showPostDetail && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-primary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary-900">
                  Chi tiết bài viết
                </h2>
                <button 
                  onClick={() => setShowPostDetail(false)}
                  className="text-primary-600 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Post Header */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusInfo(selectedPost.status).bg} ${getStatusInfo(selectedPost.status).color}`}>
                    {getStatusInfo(selectedPost.status).text}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedPost.category)}`}>
                    {selectedPost.category}
                  </span>
                </div>
                
                <h1 className="text-2xl font-bold text-primary-900 mb-2">{selectedPost.title}</h1>
                <p className="text-primary-600 mb-4">{selectedPost.excerpt}</p>
                
                <div className="flex items-center gap-6 text-sm text-primary-500">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{selectedPost.author || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Tạo: {formatDate(selectedPost.created_at)}</span>
                  </div>
                  {selectedPost.published_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Xuất bản: {formatDate(selectedPost.published_at)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              {(() => {
                const imageUrl = getImageUrl(selectedPost.featured_image);
                return imageUrl && isValidUrl(imageUrl) && (
                  <div>
                    <h3 className="font-semibold text-primary-900 mb-2">Ảnh đại diện</h3>
                    <div className="relative w-full h-64 border border-gray-300 rounded-xl overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={selectedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-primary-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedPost.views?.toLocaleString() || 0}</div>
                  <div className="text-blue-800">Lượt xem</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{selectedPost.likes || 0}</div>
                  <div className="text-red-800">Lượt thích</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedPost.comments || 0}</div>
                  <div className="text-green-800">Bình luận</div>
                </div>
              </div>

              {/* Content Preview */}
              <div>
                <h3 className="font-semibold text-primary-900 mb-2">Nội dung</h3>
                <div className="bg-primary-50 rounded-xl p-4">
                  <p className="text-primary-700 whitespace-pre-wrap">{selectedPost.content}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-primary-200">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => selectedPost && startEditPost(selectedPost)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                    Chỉnh sửa
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                    Xem trước
                  </button>
                </div>
                
                <button 
                  onClick={() => handleDeletePost(selectedPost.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa bài viết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-primary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary-900">
                  Chỉnh sửa bài viết
                </h2>
                <button 
                  onClick={() => {
                    setEditingPost(null);
                    resetForm();
                  }}
                  className="text-primary-600 hover:text-red-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề bài viết
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        title: e.target.value,
                        slug: prev.slug || generateSlug(e.target.value)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nhập tiêu đề bài viết..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="url-slug-tu-dong-tao"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL slug sẽ được tự động tạo từ tiêu đề nếu để trống
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả ngắn
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      placeholder="Mô tả ngắn về bài viết..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="tag1, tag2, tag3..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="draft">Bản nháp</option>
                      <option value="published">Đã xuất bản</option>
                      <option value="scheduled">Lên lịch</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung bài viết
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      {/* Toolbar */}
                      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => document.execCommand('bold')}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 font-bold"
                          title="Bold"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('italic')}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 italic"
                          title="Italic"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('underline')}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 underline"
                          title="Underline"
                        >
                          U
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <button
                          type="button"
                          onClick={() => document.execCommand('justifyLeft')}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                          title="Align Left"
                        >
                          ⬅
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('justifyCenter')}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                          title="Align Center"
                        >
                          ⬆
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('justifyRight')}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                          title="Align Right"
                        >
                          ➡
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              document.execCommand('formatBlock', false, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                          title="Format"
                        >
                          <option value="">Format</option>
                          <option value="h1">Heading 1</option>
                          <option value="h2">Heading 2</option>
                          <option value="h3">Heading 3</option>
                          <option value="p">Paragraph</option>
                        </select>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <button
                          type="button"
                          onClick={() => document.execCommand('insertUnorderedList')}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                          title="Bullet List"
                        >
                          •
                        </button>
                        <button
                          type="button"
                          onClick={() => document.execCommand('insertOrderedList')}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                          title="Numbered List"
                        >
                          1.
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Enter URL:');
                            if (url) document.execCommand('createLink', false, url);
                          }}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                          title="Insert Link"
                        >
                          🔗
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const color = prompt('Enter color (e.g., #ff0000 or red):');
                            if (color) document.execCommand('foreColor', false, color);
                          }}
                          className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100"
                          title="Text Color"
                        >
                          🎨
                        </button>
                      </div>
                      
                      {/* Content Editor */}
                      <div
                        contentEditable
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                        onInput={(e) => {
                          const content = e.currentTarget.innerHTML;
                          setFormData(prev => ({ ...prev, content }));
                        }}
                        className="w-full min-h-[300px] p-3 focus:outline-none"
                        style={{ minHeight: '300px' }}
                        placeholder="Nhập nội dung bài viết..."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Sử dụng thanh công cụ để định dạng văn bản. Hỗ trợ: in đậm, in nghiêng, gạch chân, căn lề, danh sách, link, màu chữ.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hình ảnh đại diện
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        featured_image: e.target.files?.[0] || null 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {formData.featured_image && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="relative w-32 h-24 border border-gray-300 rounded-lg overflow-hidden">
                          <Image
                            src={URL.createObjectURL(formData.featured_image)}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    {!formData.featured_image && editingPost?.featured_image && (() => {
                      const imageUrl = getImageUrl(editingPost.featured_image);
                      return imageUrl && isValidUrl(imageUrl) && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Ảnh hiện tại:</p>
                          <div className="relative w-32 h-24 border border-gray-300 rounded-lg overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt="Current image"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-primary-200">
                <button
                  onClick={() => {
                    setEditingPost(null);
                    resetForm();
                  }}
                  className="px-6 py-3 text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleEditPost}
                  className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-colors"
                >
                  Cập nhật bài viết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}