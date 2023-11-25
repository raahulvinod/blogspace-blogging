import express from 'express';

import {
  googleAuth,
  signinUser,
  signupUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', signupUser);
router.post('/signin', signinUser);
router.post('/google-auth', googleAuth);

export default router;
