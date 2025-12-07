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
    console.log('Creating habit with data:', {
        userId: req.userId,
        name: name.trim(),
        description: description?.trim(),
        frequency: frequency || 'DAILY',
        category: category || 'OTHER',
        color,
        icon
    });

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
    console.error('Create habit error detailed:', error);
    res.status(500).json({ error: 'Failed to create habit', details: error.message });
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
