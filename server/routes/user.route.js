import express from 'express';
import {
  allNotificationsCount,
  getUserProfile,
  isLikedByUser,
  newNotification,
  notifications,
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
router.post('/notifications', verifyToken, notifications);
router.post('/all-notification-count', verifyToken, allNotificationsCount);

export default router;
