import asyncHandler from 'express-async-handler';
import { generateUploadURL } from '../services/bucket.service.js';

// Get upload url
export const getUploadURL = asyncHandler(async (req, res) => {
  const url = await generateUploadURL();

  if (!url) {
    return res.status(400).json({ error: 'Failed to generate upload URL' });
  }

  res.status(200).json({ uploadURL: url });
});
