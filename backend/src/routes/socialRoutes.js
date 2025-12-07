import express from 'express';
import { 
  searchUsers, 
  followUser, 
  unfollowUser, 
  getFeed,
  getFollowers,
  getFollowing
} from '../controllers/socialController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/search', searchUsers); // ?query=...
router.post('/follow/:id', followUser);
router.delete('/follow/:id', unfollowUser); // Unfollow
router.get('/feed', getFeed);
router.get('/followers', getFollowers);
router.get('/following', getFollowing);

export default router;
