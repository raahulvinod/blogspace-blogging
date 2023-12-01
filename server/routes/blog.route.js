import express from 'express';
import {
  createBlog,
  getUploadURL,
  latestBlogs,
  trendingBlogs,
} from '../controllers/blog.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express();

router.get('/get-upload-url', getUploadURL);
router.get('/latest-blogs', latestBlogs);
router.get('/trending-blogs', trendingBlogs);
router.post('/create-blog', verifyToken, createBlog);

export default router;
