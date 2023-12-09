import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({
      'personal_info.username': username,
    }).select('-personal_info.password -google_auth -updatedAt -blogs');

    return res.status(200).json(user);
  } catch (error) {
    throw error;
  }
});

// Search users
export const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.body;

  try {
    const users = await User.find({
      'personal_info.username': new RegExp(query, 'i'),
    })
      .limit(50)
      .select(
        'personal_info.fullname personal_info.username personal_info.profile_img -_id'
      );

    res.status(200).json({ users });
  } catch (error) {
    throw error;
  }
});

export const isLikedByUser = asyncHandler(async (req, res) => {
  const userId = req.user;

  const { _id } = req.body;

  try {
    const result = await Notification.exists({
      user: userId,
      type: 'like',
      blog: _id,
    });

    return res.status(200).json({ result });
  } catch (error) {
    throw error;
  }
});
