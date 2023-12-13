import asyncHandler from 'express-async-handler';
import { nanoid } from 'nanoid';

import { generateUploadURL } from '../services/bucket.service.js';
import Blog from '../models/blog.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import Comment from '../models/comment.model.js';

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

  let { title, banner, content, tags, des, draft, id } = req.body;

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
    id ||
    title
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .replace(/\s+/g, '-')
      .trim() + nanoid();

  try {
    if (id) {
      const blog = await Blog.findOneAndUpdate(
        { blog_id },
        {
          title,
          des,
          banner,
          content,
          tags,
          blog_id,
          draft: draft ? draft : false,
        }
      );

      return res.status(200).json({ id: blog.blog_id });
    } else {
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
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
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
  const { tag, query, page, author, limit, eliminateBlog } = req.body;

  try {
    let findQuery;

    if (tag) {
      findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminateBlog } };
    } else if (query) {
      findQuery = { title: new RegExp(query, 'i'), draft: false };
    } else if (author) {
      findQuery = { author, draft: false };
    }

    const maxLimit = limit ? limit : 2;

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
  const { blogId, draft, mode } = req.body;

  try {
    const incrementVal = mode !== 'edit' ? 1 : 0;

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

    if (blog.draft && !draft) {
      return res.status(500).json({ error: 'You can not access draft blogs.' });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    throw error;
  }
});

// Like blog
export const likeBlog = asyncHandler(async (req, res) => {
  const userId = req.user;

  const { _id, isLikedByUser } = req.body;

  let incrementVal = !isLikedByUser ? 1 : -1;

  try {
    const blog = await Blog.findOneAndUpdate(
      { _id },
      { $inc: { 'activity.total_likes': incrementVal } }
    );

    if (!isLikedByUser) {
      let like = new Notification({
        type: 'like',
        blog: _id,
        notification_for: blog.author,
        user: userId,
      });

      await like.save();

      res.status(200).json({ likedByUser: true });
    } else {
      await Notification.findOneAndDelete({
        user: userId,
        type: 'like',
        blog: _id,
      });

      return res.status(200).json({ likedByUser: false });
    }
  } catch (error) {
    throw error;
  }
});

// Add comment
export const addComment = asyncHandler(async (req, res) => {
  try {
    const userId = req.user;

    const { _id, comment: comments, blog_author, replying_to } = req.body;

    if (!comments.length) {
      return res
        .status(403)
        .json({ error: 'Write something to leave a comment' });
    }

    let commentData = {
      blog_id: _id,
      blog_author,
      comment: comments,
      commented_by: userId,
    };

    if (replying_to) {
      commentData.parent = replying_to;
      commentData.isReply = true;
    }

    const commentFile = await new Comment(commentData).save();

    const { comment, commentedAt, children } = commentFile;

    const blog = await Blog.findOneAndUpdate(
      { _id },
      {
        $push: { comment: commentFile._id },
        $inc: {
          'activity.total_comments': 1,
          'activity.total_parent_comments': replying_to ? 0 : 1,
        },
      },
      { new: true }
    );

    let notificationData = {
      type: replying_to ? 'reply' : 'comment',
      blog: _id,
      notification_for: blog.author,
      user: userId,
      comment: commentFile._id,
    };

    if (replying_to) {
      notificationData.replied_on_comment = replying_to;

      const replyingToComment = await Comment.findOneAndUpdate(
        { _id: replying_to },
        { $push: { children: commentFile._id } }
      );

      notificationData.notification_for = replyingToComment.commented_by;
    }

    new Notification(notificationData).save();

    return res.status(200).json({
      comment,
      commentedAt,
      _id: commentFile._id,
      userId,
      children,
    });
  } catch (error) {
    throw error;
  }
});

// Get blog comments
export const getBlogComments = asyncHandler(async (req, res) => {
  try {
    const { blogId, skip } = req.body;

    let maxLimit = 5;

    const comments = await Comment.find({
      blog_id: blogId,
      isReply: false,
    })
      .populate(
        'commented_by',
        'personal_info.fullname personal_info.profile_img personal_info.username'
      )
      .skip(skip)
      .limit(maxLimit)
      .sort({
        commentedAt: -1,
      });

    return res.status(200).json(comments);
  } catch (error) {
    throw error;
  }
});

// Get replies
export const getReplies = asyncHandler(async (req, res) => {
  try {
    const { _id, skip } = req.body;

    const maxLimit = 5;

    const replies = await Comment.findOne({ _id })
      .populate({
        path: 'children',
        option: {
          limit: maxLimit,
          skip: skip,
          sort: { commentedAt: -1 },
        },
        populate: {
          path: 'commented_by',
          select:
            'personal_info.fullname personal_info.profile_img personal_info.username',
        },
        select: '-blog_id -updatedAt',
      })
      .select('children');

    return res.status(200).json({ replies: replies.children });
  } catch (error) {
    throw error;
  }
});
