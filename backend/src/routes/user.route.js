import { getUser, loginUser, logoutUser, register } from '../controllers/user.controller.js';
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Register a new user
router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  register
);

router.route('/getUser').get(getUser);
router.route('/loginUser').post(loginUser);
router.route("/logout").post(verifyJWT , logoutUser )

export default router;
