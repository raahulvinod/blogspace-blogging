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

// Update profile image
export const updateProfileImage = asyncHandler(async (req, res) => {
  try {
    const userId = req.user;
    const { url } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { 'personal_info.profile_img': url },
      { new: true }
    );

    if (user) {
      return res.status(200).json({ profile_img: url });
    }
  } catch (error) {
    throw error;
  }
});

// Update profile
export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user;
    const { username, bio, social_links } = req.body;

    const bioLimit = 150;

    if (username.length < 3) {
      return res
        .status(403)
        .json({ error: 'Username should be at least 3 letters' });
    }

    if (bio.length > bioLimit) {
      return res
        .status(403)
        .json({ error: `Bio should not be more than ${bioLimit} characters` });
    }

    let socialLinksArr = Object.keys(social_links);

    // Social links validations
    try {
      for (let i = 0; i < socialLinksArr.length; i++) {
        if (social_links[socialLinksArr[i]].length) {
          let hostname = new URL(social_links[socialLinksArr[i]]).hostname;

          if (
            !hostname.includes(`${socialLinksArr[i]}.com`) &&
            social_links[i] !== 'website'
          ) {
            return res.status(403).json({
              error: `${socialLinksArr[i]} link is invalid. You must enter a full link`,
            });
          }
        }
      }
    } catch (error) {
      return res.status(500).status({
        error: 'You must provide full social links with http(s) included',
      });
    }

    // Update profile data
    let userData = {
      'personal_info.username': username,
      'personal_info.bio': bio,
      social_links,
    };

    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $set: userData },
      { runValidators: true, new: true }
    );

    if (user) {
      return res.status(200).json({ username });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'username is already taken' });
    }

    return res.status(500).json({ error: error.message });
  }
});

export const newNotification = asyncHandler(async (req, res) => {
  try {
    const userId = req.user;

    const result = await Notification.exists({
      notification_for: userId,
      seen: false,
      user: { $ne: userId },
    });

    if (result) {
      return res.status(200).json({ new_notification_available: true });
    } else {
      return res.status(200).json({ new_notification_available: false });
    }
  } catch (error) {
    console.log(error.message);
    throw error;
  }
});

export const notifications = asyncHandler(async (req, res) => {
  try {
    const userId = req.user;

    const { page, filter, deletedDocCount } = req.body;

    const maxLimit = 10;

    const findQuery = { notification_for: userId, user: { $ne: userId } };

    const skipDocs = (page - 1) * maxLimit;

    if (filter !== 'all') {
      findQuery.type = filter;
    }

    if (deletedDocCount) {
      skipDocs -= deletedDocCount;
    }

    const notifications = await Notification.find(findQuery)
      .skip(skipDocs)
      .limit(maxLimit)
      .populate('blog', 'title blog_id')
      .populate(
        'user',
        'personal_info.fullname personal_info.username personal_info.profile_img'
      )
      .populate('comment', 'comment')
      .populate('replied_on_comment', 'comment')
      .populate('reply', 'comment')
      .sort({ createdAt: -1 })
      .select('createdAt type seen reply');

    await Notification.updateMany(findQuery, { seen: true })
      .skip(skipDocs)
      .limit(maxLimit);

    return res.status(200).json({ notifications });
  } catch (error) {
    console.log(error.message);
    throw error;
  }
});

export const allNotificationsCount = asyncHandler(async (req, res) => {
  try {
    const userId = req.user;

    const { filter } = req.body;

    const findQuery = { notification_for: userId, user: { $ne: userId } };

    if (filter !== 'all') {
      findQuery.type = filter;
    }

    const notifiationCount = await Notification.countDocuments(findQuery);

    return res.status(200).json({ totalDocs: notifiationCount });
  } catch (error) {
    console.log(error);
    throw error;
  }
});
