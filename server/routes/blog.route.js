import express from 'express';
import {
  createBlog,
  getUploadURL,
  latestBlogs,
  searchBlogs,
  trendingBlogs,
} from '../controllers/blog.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express();

router.get('/get-upload-url', getUploadURL);
router.get('/latest-blogs', latestBlogs);
router.get('/trending-blogs', trendingBlogs);
router.post('/create-blog', verifyToken, createBlog);
router.post('/search-blogs', searchBlogs);

export default router;
