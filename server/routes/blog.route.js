import express from 'express';
import { createBlog, getUploadURL } from '../controllers/blog.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express();

router.get('/get-upload-url', getUploadURL);
router.post('/create-blog', verifyToken, createBlog);

export default router;
