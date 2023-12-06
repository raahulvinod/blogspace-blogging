import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({
      'personal_info.username': username,
    }).select('-personal_info.password -google_auth -updatedAt -blogs');

    return res.status(200).json(user);
  } catch (error) {
    throw error;
  }
});
