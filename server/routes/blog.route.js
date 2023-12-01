import express from 'express';
import {
  createBlog,
  getUploadURL,
  latestBlogs,
  searchBlogs,
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

export default router;
