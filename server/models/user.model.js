import mongoose, { Schema } from 'mongoose';

import {
  profileCollectionList,
  profileNameList,
} from '../utils/randomProfileImg.js';

const userSchema = mongoose.Schema(
  {
    personal_info: {
      fullname: {
        type: String,
        lowercase: true,
        required: true,
        minlength: [3, 'fullname must be 3 letters long'],
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },
      password: String,
      username: {
        type: String,
        minlength: [3, 'Username must be 3 letters long'],
        unique: true,
      },
      bio: {
        type: String,
        maxlength: [200, 'Bio should not be more than 200'],
        default: '',
      },
      profile_img: {
        type: String,
        default: () => {
          return `https://api.dicebear.com/6.x/${
            profileCollectionList[
              Math.floor(Math.random() * profileCollectionList.length)
            ]
          }/svg?seed=${
            profileNameList[Math.floor(Math.random() * profileNameList.length)]
          }`;
        },
      },
    },
    social_links: {
      youtube: {
        type: String,
        default: '',
      },
      instagram: {
        type: String,
        default: '',
      },
      facebook: {
        type: String,
        default: '',
      },
      twitter: {
        type: String,
        default: '',
      },
      github: {
        type: String,
        default: '',
      },
      website: {
        type: String,
        default: '',
      },
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    blogs: {
      type: [Schema.Types.ObjectId],
      ref: 'blogs',
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: 'joinedAt',
    },
  }
);

const User = mongoose.model('User', userSchema);
export default User;
