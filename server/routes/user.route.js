import express from 'express';
import {
  getUserProfile,
  isLikedByUser,
  searchUsers,
  updateProfileImage,
} from '../controllers/user.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express();

router.post('/get-profile', getUserProfile);
router.post('/search-users', searchUsers);
router.post('/isliked-by-user', verifyToken, isLikedByUser);
router.post('/update-profile-image', verifyToken, updateProfileImage);

export default router;
