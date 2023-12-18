import express from 'express';

import {
  changePassword,
  googleAuth,
  signinUser,
  signupUser,
} from '../controllers/auth.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/signin', signinUser);
router.post('/google-auth', googleAuth);
router.post('/change-password', verifyToken, changePassword);

export default router;
