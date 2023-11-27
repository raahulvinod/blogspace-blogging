import express from 'express';
import { getUploadURL } from '../controllers/blog.controller.js';

const router = express();

router.get('/get-upload-url', getUploadURL);

export default router;
