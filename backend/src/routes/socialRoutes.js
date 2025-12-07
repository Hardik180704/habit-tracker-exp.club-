import express from 'express';
import { 
  searchUsers, 
  followUser, 
  unfollowUser, 
  getFeed 
} from '../controllers/socialController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/search', searchUsers); // ?query=...
router.post('/follow/:id', followUser);
router.delete('/follow/:id', unfollowUser); // Unfollow
router.get('/feed', getFeed);

export default router;
