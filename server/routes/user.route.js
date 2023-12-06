import express from 'express';
import { getUserProfile } from '../controllers/user.controller.js';

const router = express();

router.post('/get-profile', getUserProfile);

export default router;
