import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res
      .status(401)
      .json({ error: 'There is no token attached to header' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid access token.' });
  }
});

export default verifyToken;
