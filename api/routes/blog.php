<?php
// Blog routes

function handleGetBlogPosts() {
    global $pdo;
    
    $params = getQueryParams();
    $pagination = getPaginationParams();
    
    try {
        // Build WHERE clause
        $whereConditions = ['status = "published"'];
        $queryParams = [];
        
        if (!empty($params['category'])) {
            $whereConditions[] = 'category = ?';
            $queryParams[] = $params['category'];
        }
        
        if (!empty($params['search'])) {
            $whereConditions[] = '(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
            $searchTerm = '%' . $params['search'] . '%';
            $queryParams[] = $searchTerm;
            $queryParams[] = $searchTerm;
            $queryParams[] = $searchTerm;
        }
        
        $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
        
        // Count total
        $countSql = "SELECT COUNT(*) as total FROM blog_posts $whereClause";
        $stmt = $pdo->prepare($countSql);
        $stmt->execute($queryParams);
        $total = $stmt->fetch()['total'];
        
        // Get blog posts
        $sql = "
            SELECT * FROM blog_posts 
            $whereClause
            ORDER BY published_at DESC, created_at DESC
            LIMIT ? OFFSET ?
        ";
        
        $queryParams[] = $pagination['per_page'];
        $queryParams[] = $pagination['skip'];
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($queryParams);
        $posts = $stmt->fetchAll();
        
        // Format posts
        $formattedPosts = array_map('formatBlogPost', $posts);
        
        $response = formatPaginationResponse(
            $formattedPosts,
            $total,
            $pagination['page'],
            $pagination['per_page']
        );
        
        sendSuccess('Blog posts retrieved', $response);
        
    } catch (Exception $e) {
        error_log('Get blog posts error: ' . $e->getMessage());
        sendInternalError('Failed to get blog posts');
    }
}

function handleGetFeaturedPosts() {
    global $pdo;
    
    $limit = $_GET['limit'] ?? 5;
    $limit = min(20, max(1, intval($limit)));
    
    try {
        $sql = "
            SELECT * FROM blog_posts 
            WHERE status = 'published' AND views > 0
            ORDER BY views DESC, likes DESC, published_at DESC
            LIMIT ?
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$limit]);
        $posts = $stmt->fetchAll();
        
        $formattedPosts = array_map('formatBlogPost', $posts);
        
        sendSuccess('Featured posts retrieved', $formattedPosts);
        
    } catch (Exception $e) {
        error_log('Get featured posts error: ' . $e->getMessage());
        sendInternalError('Failed to get featured posts');
    }
}

function handleGetBlogPost($id) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE id = ?");
        $stmt->execute([$id]);
        $post = $stmt->fetch();
        
        if (!$post) {
            sendNotFound('Blog post not found');
        }
        
        // Increment view count
        $stmt = $pdo->prepare("UPDATE blog_posts SET views = views + 1 WHERE id = ?");
        $stmt->execute([$id]);
        
        sendSuccess('Blog post retrieved', formatBlogPost($post));
        
    } catch (Exception $e) {
        error_log('Get blog post error: ' . $e->getMessage());
        sendInternalError('Failed to get blog post');
    }
}

function handleGetBlogPostBySlug($slug) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE slug = ? AND status = 'published'");
        $stmt->execute([$slug]);
        $post = $stmt->fetch();
        
        if (!$post) {
            sendNotFound('Blog post not found');
        }
        
        // Increment view count
        $stmt = $pdo->prepare("UPDATE blog_posts SET views = views + 1 WHERE id = ?");
        $stmt->execute([$post['id']]);
        
        sendSuccess('Blog post retrieved', formatBlogPost($post));
        
    } catch (Exception $e) {
        error_log('Get blog post by slug error: ' . $e->getMessage());
        sendInternalError('Failed to get blog post');
    }
}

function handleCreateBlogPost() {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'title' => ['required', ['string', 1, 255]],
        'excerpt' => [['string', 0, 500]],
        'content' => ['required', ['string', 1]],
        'category' => ['required', ['string', 1, 100]],
        'tags' => ['array'],
        'status' => [['in', ['draft', 'published', 'archived']]],
        'author' => ['required', ['string', 1, 255]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        // Generate slug from title
        $slug = generateSlug($data['title']);
        
        // Ensure slug is unique
        $originalSlug = $slug;
        $counter = 1;
        while (true) {
            $stmt = $pdo->prepare("SELECT id FROM blog_posts WHERE slug = ?");
            $stmt->execute([$slug]);
            if (!$stmt->fetch()) {
                break;
            }
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        // Prepare data
        $tags = !empty($data['tags']) ? json_encode($data['tags']) : null;
        $status = $data['status'] ?? 'draft';
        $publishedAt = $status === 'published' ? date('Y-m-d H:i:s') : null;
        
        $sql = "
            INSERT INTO blog_posts (
                title, slug, excerpt, content, category, tags, status, 
                author, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['title'],
            $slug,
            $data['excerpt'] ?? null,
            $data['content'],
            $data['category'],
            $tags,
            $status,
            $data['author'],
            $publishedAt
        ]);
        
        $postId = $pdo->lastInsertId();
        
        // Get created post
        $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE id = ?");
        $stmt->execute([$postId]);
        $post = $stmt->fetch();
        
        sendSuccess('Blog post created successfully', formatBlogPost($post), 201);
        
    } catch (Exception $e) {
        error_log('Create blog post error: ' . $e->getMessage());
        sendInternalError('Failed to create blog post');
    }
}

function handleUpdateBlogPost($id) {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'title' => [['string', 1, 255]],
        'excerpt' => [['string', 0, 500]],
        'content' => [['string', 1]],
        'category' => [['string', 1, 100]],
        'tags' => ['array'],
        'status' => [['in', ['draft', 'published', 'archived']]],
        'author' => [['string', 1, 255]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        // Check if post exists
        $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE id = ?");
        $stmt->execute([$id]);
        $post = $stmt->fetch();
        
        if (!$post) {
            sendNotFound('Blog post not found');
        }
        
        // Build update query
        $updateFields = [];
        $params = [];
        
        if (isset($data['title'])) {
            $updateFields[] = 'title = ?';
            $params[] = $data['title'];
            
            // Update slug if title changed
            $newSlug = generateSlug($data['title']);
            if ($newSlug !== $post['slug']) {
                // Ensure new slug is unique
                $originalSlug = $newSlug;
                $counter = 1;
                while (true) {
                    $stmt = $pdo->prepare("SELECT id FROM blog_posts WHERE slug = ? AND id != ?");
                    $stmt->execute([$newSlug, $id]);
                    if (!$stmt->fetch()) {
                        break;
                    }
                    $newSlug = $originalSlug . '-' . $counter;
                    $counter++;
                }
                
                $updateFields[] = 'slug = ?';
                $params[] = $newSlug;
            }
        }
        
        if (isset($data['excerpt'])) {
            $updateFields[] = 'excerpt = ?';
            $params[] = $data['excerpt'];
        }
        
        if (isset($data['content'])) {
            $updateFields[] = 'content = ?';
            $params[] = $data['content'];
        }
        
        if (isset($data['category'])) {
            $updateFields[] = 'category = ?';
            $params[] = $data['category'];
        }
        
        if (isset($data['tags'])) {
            $updateFields[] = 'tags = ?';
            $params[] = json_encode($data['tags']);
        }
        
        if (isset($data['status'])) {
            $updateFields[] = 'status = ?';
            $params[] = $data['status'];
            
            // Set published_at if status changed to published
            if ($data['status'] === 'published' && $post['status'] !== 'published') {
                $updateFields[] = 'published_at = NOW()';
            }
        }
        
        if (isset($data['author'])) {
            $updateFields[] = 'author = ?';
            $params[] = $data['author'];
        }
        
        if (empty($updateFields)) {
            sendError('No fields to update', 400);
        }
        
        $updateFields[] = 'updated_at = NOW()';
        $params[] = $id;
        
        $sql = "UPDATE blog_posts SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Get updated post
        $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE id = ?");
        $stmt->execute([$id]);
        $post = $stmt->fetch();
        
        sendSuccess('Blog post updated successfully', formatBlogPost($post));
        
    } catch (Exception $e) {
        error_log('Update blog post error: ' . $e->getMessage());
        sendInternalError('Failed to update blog post');
    }
}

function handleDeleteBlogPost($id) {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Check if post exists
        $stmt = $pdo->prepare("SELECT id FROM blog_posts WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            sendNotFound('Blog post not found');
        }
        
        // Delete post
        $stmt = $pdo->prepare("DELETE FROM blog_posts WHERE id = ?");
        $stmt->execute([$id]);
        
        sendSuccess('Blog post deleted successfully');
        
    } catch (Exception $e) {
        error_log('Delete blog post error: ' . $e->getMessage());
        sendInternalError('Failed to delete blog post');
    }
}

function handleUploadFeaturedImage($postId) {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Check if post exists
        $stmt = $pdo->prepare("SELECT id FROM blog_posts WHERE id = ?");
        $stmt->execute([$postId]);
        if (!$stmt->fetch()) {
            sendNotFound('Blog post not found');
        }
        
        if (!isset($_FILES['file'])) {
            sendError('No file uploaded', 400);
        }
        
        $file = $_FILES['file'];
        $error = validateFile($file, 'file', ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE);
        if ($error) {
            sendError($error, 400);
        }
        
        // Generate unique filename
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $newFilename = uniqid() . '_' . time() . '.' . $extension;
        $uploadPath = UPLOAD_DIR . 'blog/' . $newFilename;
        
        if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
            sendError('Failed to upload image', 500);
        }
        
        // Update post with featured image
        $imagePath = '/uploads/blog/' . $newFilename;
        $stmt = $pdo->prepare("UPDATE blog_posts SET featured_image = ? WHERE id = ?");
        $stmt->execute([$imagePath, $postId]);
        
        sendSuccess('Featured image uploaded successfully', [
            'featured_image' => $imagePath
        ]);
        
    } catch (Exception $e) {
        error_log('Upload featured image error: ' . $e->getMessage());
        sendInternalError('Failed to upload featured image');
    }
}

function handleGetBlogCategories() {
    global $pdo;
    
    try {
        $sql = "SELECT DISTINCT category FROM blog_posts WHERE status = 'published' ORDER BY category";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        sendSuccess('Blog categories retrieved', $categories);
        
    } catch (Exception $e) {
        error_log('Get blog categories error: ' . $e->getMessage());
        sendInternalError('Failed to get blog categories');
    }
}

function handleGetBlogStats() {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Get blog statistics
        $sql = "
            SELECT 
                COUNT(*) as total_posts,
                SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_posts,
                SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_posts,
                SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived_posts,
                SUM(views) as total_views,
                SUM(likes) as total_likes,
                AVG(views) as average_views
            FROM blog_posts
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $stats = $stmt->fetch();
        
        // Get popular posts
        $sql = "
            SELECT 
                id, title, slug, views, likes, published_at
            FROM blog_posts 
            WHERE status = 'published'
            ORDER BY views DESC, likes DESC
            LIMIT 5
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $popularPosts = $stmt->fetchAll();
        
        $response = [
            'summary' => [
                'total_posts' => (int)$stats['total_posts'],
                'published_posts' => (int)$stats['published_posts'],
                'draft_posts' => (int)$stats['draft_posts'],
                'archived_posts' => (int)$stats['archived_posts'],
                'total_views' => (int)$stats['total_views'],
                'total_likes' => (int)$stats['total_likes'],
                'average_views' => (float)$stats['average_views']
            ],
            'popular_posts' => array_map(function($post) {
                return [
                    'id' => (int)$post['id'],
                    'title' => $post['title'],
                    'slug' => $post['slug'],
                    'views' => (int)$post['views'],
                    'likes' => (int)$post['likes'],
                    'published_at' => $post['published_at']
                ];
            }, $popularPosts)
        ];
        
        sendSuccess('Blog statistics retrieved', $response);
        
    } catch (Exception $e) {
        error_log('Get blog stats error: ' . $e->getMessage());
        sendInternalError('Failed to get blog statistics');
    }
}

function formatBlogPost($post) {
    $tags = json_decode($post['tags'], true) ?: [];
    
    return [
        'id' => (int)$post['id'],
        'title' => $post['title'],
        'slug' => $post['slug'],
        'excerpt' => $post['excerpt'],
        'content' => $post['content'],
        'category' => $post['category'],
        'tags' => $tags,
        'status' => $post['status'],
        'author' => $post['author'],
        'featured_image' => $post['featured_image'],
        'views' => (int)$post['views'],
        'likes' => (int)$post['likes'],
        'comments' => (int)$post['comments'],
        'created_at' => $post['created_at'],
        'updated_at' => $post['updated_at'],
        'published_at' => $post['published_at']
    ];
}

function generateSlug($title) {
    // Convert to lowercase
    $slug = strtolower($title);
    
    // Replace Vietnamese characters
    $vietnamese = [
        'à', 'á', 'ạ', 'ả', 'ã', 'â', 'ầ', 'ấ', 'ậ', 'ẩ', 'ẫ', 'ă', 'ằ', 'ắ', 'ặ', 'ẳ', 'ẵ',
        'è', 'é', 'ẹ', 'ẻ', 'ẽ', 'ê', 'ề', 'ế', 'ệ', 'ể', 'ễ',
        'ì', 'í', 'ị', 'ỉ', 'ĩ',
        'ò', 'ó', 'ọ', 'ỏ', 'õ', 'ô', 'ồ', 'ố', 'ộ', 'ổ', 'ỗ', 'ơ', 'ờ', 'ớ', 'ợ', 'ở', 'ỡ',
        'ù', 'ú', 'ụ', 'ủ', 'ũ', 'ư', 'ừ', 'ứ', 'ự', 'ử', 'ữ',
        'ỳ', 'ý', 'ỵ', 'ỷ', 'ỹ',
        'đ'
    ];
    
    $english = [
        'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a',
        'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e',
        'i', 'i', 'i', 'i', 'i',
        'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
        'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u',
        'y', 'y', 'y', 'y', 'y',
        'd'
    ];
    
    $slug = str_replace($vietnamese, $english, $slug);
    
    // Remove special characters and replace spaces with hyphens
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    $slug = trim($slug, '-');
    
    return $slug;
}
?>
