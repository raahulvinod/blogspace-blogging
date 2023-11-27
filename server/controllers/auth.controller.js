import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { getAuth } from 'firebase-admin/auth';

import admin from '../config/firebase.js';
import User from '../models/user.model.js';
import { formatDataToSend, generateUsername } from '../utils/user-utils.js';

// Signup user
export const signupUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  // Check if the email already exists
  const existingUser = await User.findOne({ 'personal_info.email': email });

  if (existingUser) {
    return res.status(409).json({ error: 'Email is already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const username = await generateUsername(email);

  const user = new User({
    personal_info: {
      fullname,
      email,
      password: hashedPassword,
      username,
    },
  });

  await user.save();

  res.status(201).json(formatDataToSend(user));
});

// signin user
export const signinUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ 'personal_info.email': email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid email' });
  }

  if (!user.google_auth) {
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.personal_info.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    return res.status(200).json(formatDataToSend(user));
  } else {
    return res.status(403).json({
      error: 'Account was created using google. Try logging in with google.',
    });
  }
});

export const googleAuth = asyncHandler(async (req, res) => {
  try {
    const { access_token } = req.body;
    const decodedUser = await getAuth().verifyIdToken(access_token);

    let { email, name, picture } = decodedUser;
    picture = picture.replace('s96-c', 's384-c');

    let user = await User.findOne({
      'personal_info.email': email,
    }).select(
      'personal_info.fullname personal_info.username personal_info.profile_img google_auth'
    );

    if (user) {
      if (!user.google_auth) {
        return res.status(403).json({
          error:
            'This email was signed up without Google. Please log in with a password to access this account.',
        });
      }
    } else {
      const username = await generateUsername(email);

      user = new User({
        personal_info: {
          fullname: name,
          email,
          profile_img: picture,
          username,
        },
        google_auth: true,
      });

      await user.save();
    }

    return res.status(200).json(formatDataToSend(user));
  } catch (error) {
    console.error('Error during Google authentication:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
