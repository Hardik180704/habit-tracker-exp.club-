import express from 'express';
import { 
  getAllHabits, 
  createHabit, 
  updateHabit, 
  deleteHabit,
  checkInHabit,
  getHabitStats
} from '../controllers/habitsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllHabits);
router.post('/', createHabit);
router.put('/:id', updateHabit);
router.delete('/:id', deleteHabit);

// Stats & Check-ins
router.post('/:id/checkin', checkInHabit);
router.get('/:id/stats', getHabitStats);

export default router;
