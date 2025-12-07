import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllHabits = async (req, res) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ habits });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
};

export const createHabit = async (req, res) => {
  try {
    const { name, description, frequency, category, color, icon } = req.body;
    
    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Habit name is required' });
    }
    
    if (name.length > 100) {
      return res.status(400).json({ error: 'Habit name too long (max 100 chars)' });
    }
    
    // Check for duplicate (case-insensitive)
    const existing = await prisma.habit.findFirst({
      where: {
        userId: req.userId,
        name: {
          equals: name.trim(),
          mode: 'insensitive'
        }
      }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'You already have a habit with this name' });
    }
    
    // Create habit
    const habit = await prisma.habit.create({
      data: {
        userId: req.userId,
        name: name.trim(),
        description: description?.trim(),
        frequency: frequency || 'DAILY',
        category: category || 'OTHER',
        color,
        icon
      }
    });
    
    res.status(201).json({ habit });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, frequency, category, color, icon } = req.body;
    
    // Check ownership
    const habit = await prisma.habit.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    if (habit.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Check duplicate name (if name changed)
    if (name && name.trim() !== habit.name) {
      const duplicate = await prisma.habit.findFirst({
        where: {
          userId: req.userId,
          name: {
            equals: name.trim(),
            mode: 'insensitive'
          },
          NOT: {
            id: parseInt(id)
          }
        }
      });
      
      if (duplicate) {
        return res.status(400).json({ error: 'You already have a habit with this name' });
      }
    }
    
    // Update habit
    const updated = await prisma.habit.update({
      where: { id: parseInt(id) },
      data: {
        name: name?.trim(),
        description: description?.trim(),
        frequency,
        category,
        color,
        icon
      }
    });
    
    res.json({ habit: updated });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ error: 'Failed to update habit' });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check ownership
    const habit = await prisma.habit.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    if (habit.userId !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    // Delete habit (completions will cascade delete)
    await prisma.habit.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
};

export const checkInHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body; // Expects YYYY-MM-DD
    
    // Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Date must be in YYYY-MM-DD format' });
    }
    
    // Check ownership
    const habit = await prisma.habit.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!habit || habit.userId !== req.userId) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    const checkInDate = new Date(date);
    
    // Check if already completed
    const existingCompletion = await prisma.completion.findFirst({
      where: {
        habitId: parseInt(id),
        completedAt: checkInDate
      }
    });
    
    if (existingCompletion) {
      // Toggle off (Remove completion)
      await prisma.completion.delete({
        where: { id: existingCompletion.id }
      });
      return res.json({ message: 'Check-in removed', completed: false });
    } else {
      // Toggle on (Add completion)
      const completion = await prisma.completion.create({
        data: {
          habitId: parseInt(id),
          userId: req.userId,
          completedAt: checkInDate
        }
      });
      return res.json({ message: 'Check-in successful', completed: true, completion });
    }
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Failed to update check-in status' });
  }
};

export const getHabitStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check ownership
    const habit = await prisma.habit.findUnique({
      where: { id: parseInt(id) },
      include: {
        completions: {
          orderBy: { completedAt: 'desc' }
        }
      }
    });
    
    if (!habit || habit.userId !== req.userId) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    // Calculate Streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedCompletions = habit.completions.map(c => {
      const d = new Date(c.completedAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }).sort((a, b) => b - a); // Descending
    
    // Check if completed today or yesterday to exist in streak
    if (sortedCompletions.length > 0) {
      const lastCompletion = sortedCompletions[0];
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If completed today or yesterday, streak is active
      if (lastCompletion === today.getTime() || lastCompletion === yesterday.getTime()) {
        currentStreak = 1;
        
        // Count backwards
        for (let i = 0; i < sortedCompletions.length - 1; i++) {
          const current = sortedCompletions[i];
          const next = sortedCompletions[i + 1];
          const diffDays = (current - next) / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
    
    res.json({
      streak: currentStreak,
      totalCompletions: habit.completions.length,
      completions: habit.completions // Return dates for calendar
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
