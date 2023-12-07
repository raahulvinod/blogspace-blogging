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

// Get latest blogs
export const latestBlogs = asyncHandler(async (req, res) => {
  try {
    const { page } = req.body;

    const maxLimit = 5;

    const blogs = await Blog.find({ draft: false })
      .populate(
        'author',
        'personal_info.profile_img personal_info.fullname personal_info.username -_id'
      )
      .sort({ publishedAt: -1 })
      .select('blog_id title des banner activity tags publishedAt -_id')
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);

    return res.status(200).json({ blogs });
  } catch (error) {
    throw error;
  }
});

// Total blogs count
export const totalBlogCount = asyncHandler(async (req, res) => {
  try {
    const count = await Blog.countDocuments({ draft: false });

    res.status(200).json({ totalDocs: count });
  } catch (error) {
    throw error;
  }
});

// Get trending blogs
export const trendingBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({ draft: false })
      .populate(
        'author',
        'personal_info.profile_img personal_info.fullname personal_info.username -_id'
      )
      .sort({
        'activity.total_read': -1,
        'activity.total_likes': -1,
        publishedAt: -1,
      })
      .select('blog_id title publishedAt -_id')
      .limit(5);

    return res.status(200).json({ blogs });
  } catch (error) {
    throw error;
  }
});

// Search blogs
export const searchBlogs = asyncHandler(async (req, res) => {
  try {
    const { tag, query, page, author } = req.body;

    let findQuery;

    if (tag) {
      findQuery = { tags: tag, draft: false };
    } else if (query) {
      findQuery = { title: new RegExp(query, 'i'), draft: false };
    } else if (author) {
      findQuery = { author, draft: false };
    }

    const maxLimit = 2;

    const blogs = await Blog.find(findQuery)
      .populate(
        'author',
        'personal_info.profile_img personal_info.fullname personal_info.username -_id'
      )
      .sort({ publishedAt: -1 })
      .select('blog_id title des banner activity tags publishedAt -_id')
      .skip((page - 1) * maxLimit)
      .limit(maxLimit);

    return res.status(200).json({ blogs });
  } catch (error) {
    throw error;
  }
});

export const searchBlogCount = asyncHandler(async (req, res) => {
  try {
    const { tag, query, author } = req.body;
    let findQuery;

    if (tag) {
      findQuery = { tags: tag, draft: false };
    } else if (query) {
      findQuery = { title: new RegExp(query, 'i'), draft: false };
    } else if (author) {
      findQuery = { author, draft: false };
    }

    const count = await Blog.countDocuments(findQuery);

    res.status(200).json({ totalDocs: count });
  } catch (error) {
    throw error;
  }
});

// Get blogs
export const getBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;

  try {
    const incrementVal = 1;

    const blog = await Blog.findOneAndUpdate(
      { blog_id: blogId },
      { $inc: { 'activity.total_reads': incrementVal } }
    )
      .populate(
        'author',
        'personal_info.fullname personal_info.username personal_info.profile_img'
      )
      .select('title des content banner activity publishedAt blog_id tags');

    await User.findOneAndUpdate(
      {
        'personal_info.username': blog.author.personal_info.username,
      },
      { $inc: { 'account_info.total_reads': incrementVal } }
    );

    return res.status(200).json({ blog });
  } catch (error) {
    throw error;
  }
});
