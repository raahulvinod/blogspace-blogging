import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';

export const generateUsername = async (email) => {
  const username = email.split('@')[0];

  try {
    const usernameExists = await User.exists({
      'personal_info.username': username,
    });

    const finalUsername = usernameExists
      ? username + nanoid().substring(0, 5)
      : username;

    return finalUsername;
  } catch (error) {
    throw error;
  }
};

export const formatDatatoSend = (user) => {
  const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};
