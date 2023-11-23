import { nanoid } from 'nanoid';

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
