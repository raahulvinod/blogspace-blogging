import express from 'express';
import {
  addComment,
  createBlog,
  deleteBlog,
  deleteComment,
  getBlog,
  getBlogComments,
  getReplies,
  getUploadURL,
  latestBlogs,
  likeBlog,
  searchBlogCount,
  searchBlogs,
  totalBlogCount,
  trendingBlogs,
  userWrittenBlogs,
  userWrittenBlogsCount,
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
router.post('/get-blog', getBlog);
router.post('/like-blog', verifyToken, likeBlog);
router.post('/add-comment', verifyToken, addComment);
router.post('/get-blog-comments', getBlogComments);
router.post('/get-replies', getReplies);
router.post('/delete-comment', verifyToken, deleteComment);
router.post('/user-written-blogs', verifyToken, userWrittenBlogs);
router.post('/user-written-blogs-count', verifyToken, userWrittenBlogsCount);
router.post('/delete-blog', verifyToken, deleteBlog);

export default router;
