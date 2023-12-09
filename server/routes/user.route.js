import express from 'express';
import {
  getUserProfile,
  isLikedByUser,
  searchUsers,
} from '../controllers/user.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express();

router.post('/get-profile', getUserProfile);
router.post('/search-users', searchUsers);
router.post('/isliked-by-user', verifyToken, isLikedByUser);

export default router;
