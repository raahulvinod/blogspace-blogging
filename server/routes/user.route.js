import express from 'express';
import { getUserProfile, searchUsers } from '../controllers/user.controller.js';

const router = express();

router.post('/get-profile', getUserProfile);
router.post('/search-users', searchUsers);

export default router;
