'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  ArrowLeft, 
  Share2,
  Clock,
  Tag
} from 'lucide-react';
import { blogAPI, BlogPost, getImageUrl } from '@/lib/services/api';
import { useToast } from '@/contexts/ToastContext';

export default function BlogDetailPage() {
  const { showToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to get post by slug first, then by ID if slug fails
      let postData: BlogPost | null = null;
      
      try {
        postData = await blogAPI.getBlogPostBySlug(slug);
      } catch (slugError) {
        // If slug fails, try to parse as ID
        const id = parseInt(slug);
        if (!isNaN(id)) {
          postData = await blogAPI.getBlogPost(id);
        }
      }
      
      if (postData) {
        setPost(postData);
        // Fetch related posts
        const related = await blogAPI.getBlogPosts({ 
          category: postData.category, 
          limit: 3 
        });
        setRelatedPosts(related.filter(p => p.id !== postData.id));
      } else {
        setError('Không tìm thấy bài viết');
      }
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      setError('Có lỗi xảy ra khi tải bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showToast({
        type: 'success',
        title: 'Đã copy link!',
        message: 'Link bài viết đã được copy vào clipboard.',
        duration: 2000
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vintage-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-primary-200 rounded w-1/4 mb-8"></div>
            <div className="h-4 bg-primary-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-primary-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-primary-200 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-primary-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-primary-200 rounded"></div>
              <div className="h-4 bg-primary-200 rounded"></div>
              <div className="h-4 bg-primary-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-vintage-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-primary-900 mb-4">
              {error || 'Không tìm thấy bài viết'}
            </h1>
            <p className="text-primary-600 mb-8">
              Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vintage-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center gap-2 text-sm text-primary-600">
            <Link href="/" className="hover:text-accent-500 transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-accent-500 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-primary-800 font-medium line-clamp-1">{post.title}</span>
          </div>
        </nav>

        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-accent-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại Blog
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-vintage overflow-hidden">
          {/* Featured Image */}
          {(() => {
            const imageUrl = getImageUrl(post.featured_image);
            return imageUrl && isValidUrl(imageUrl) && (
              <div className="relative h-64 md:h-96">
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            );
          })()}

          <div className="p-8">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-accent-100 text-accent-700 text-sm font-medium rounded-full">
                  {post.category}
                </span>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                  {post.status}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-lg text-primary-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-primary-500 mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author || 'Admin'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>5 phút đọc</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.views?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments || 0}</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-accent-500 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Chia sẻ
                </button>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-primary-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-primary-900 mb-8">Bài viết liên quan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="bg-white rounded-2xl shadow-vintage overflow-hidden hover:shadow-xl transition-shadow">
                  {(() => {
                    const imageUrl = getImageUrl(relatedPost.featured_image);
                    return imageUrl && isValidUrl(imageUrl) && (
                      <div className="relative h-48">
                        <Image
                          src={imageUrl}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    );
                  })()}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                        {relatedPost.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-primary-900 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-primary-600 mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-primary-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{relatedPost.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{relatedPost.likes || 0}</span>
                        </div>
                      </div>
                      <span>{formatDate(relatedPost.created_at)}</span>
                    </div>
                    <Link 
                      href={`/blog/${relatedPost.slug || relatedPost.id}`}
                      className="block mt-4 text-accent-600 hover:text-accent-700 font-medium text-sm"
                    >
                      Đọc thêm →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
