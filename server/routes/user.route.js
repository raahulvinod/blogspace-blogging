import express from 'express';
import {
  getUserProfile,
  isLikedByUser,
  newNotification,
  searchUsers,
  updateProfile,
  updateProfileImage,
} from '../controllers/user.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express();

router.post('/get-profile', getUserProfile);
router.post('/search-users', searchUsers);
router.post('/isliked-by-user', verifyToken, isLikedByUser);
router.post('/update-profile-image', verifyToken, updateProfileImage);
router.post('/update-profile', verifyToken, updateProfile);
router.get('/new-notification', verifyToken, newNotification);

export default router;
