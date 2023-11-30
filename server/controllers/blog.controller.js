import asyncHandler from 'express-async-handler';
import { nanoid } from 'nanoid';

import { generateUploadURL } from '../services/bucket.service.js';
import Blog from '../models/blog.model.js';
import User from '../models/user.model.js';

// Get upload url
export const getUploadURL = asyncHandler(async (req, res) => {
  const url = await generateUploadURL();

  if (!url) {
    return res.status(400).json({ error: 'Failed to generate upload URL' });
  }

  res.status(200).json({ uploadURL: url });
});

// Create a blog
export const createBlog = asyncHandler(async (req, res) => {
  const authorId = req.user;

  let { title, banner, content, tags, des, draft } = req.body;

  if (!title || !title.length) {
    return res.status(403).json({ error: 'Title is required.' });
  }

  if (!draft) {
    if (!des || !des.length || des.length > 200) {
      return res.status(403).json({
        error: 'Description is required and must be under 200 characters.',
      });
    }

    if (!banner || !banner.length) {
      return res.status(403).json({ error: 'Banner image is required.' });
    }

    if (!content || !content.blocks || !content.blocks.length) {
      return res
        .status(403)
        .json({ error: 'Content is required for publishing.' });
    }

    if (!tags || !tags.length || tags.length > 10) {
      return res.status(403).json({
        error: 'Provide tags for the blog, up to a maximum of 10.',
      });
    }
  }

  tags = tags.map((tag) => tag.toLowerCase());

  const blog_id =
    title
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/\s+/g, '-')
      .trim() + nanoid();

  const isDraft = Boolean(draft);

  const blog = new Blog({
    title,
    des,
    banner,
    content,
    tags,
    author: authorId,
    blog_id,
    draft: isDraft,
  });

  await blog.save();

  const incrementVal = isDraft ? 0 : 1;

  const user = await User.findOneAndUpdate(
    { _id: authorId },
    {
      $inc: { 'account_info.total_posts': incrementVal },
      $push: { blogs: blog._id },
    }
  );

  return res.status(200).json({ id: blog.blog_id });
});
