import express from 'express';
import {
  createBlog,
  getUploadURL,
  latestBlogs,
  searchBlogCount,
  searchBlogs,
  searchUsers,
  totalBlogCount,
  trendingBlogs,
} from '../controllers/blog.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express();

router.get('/get-upload-url', getUploadURL);
router.get('/trending-blogs', trendingBlogs);
router.post('/create-blog', verifyToken, createBlog);
router.post('/search-blogs', searchBlogs);
router.post('/latest-blogs', latestBlogs);
router.post('/all-latest-blog-count', totalBlogCount);
router.post('/search-blog-count', searchBlogCount);
router.post('/search-users', searchUsers);

export default router;
