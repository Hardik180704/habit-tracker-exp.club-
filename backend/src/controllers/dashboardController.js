import prisma from '../utils/prisma.js';
import { startOfWeek, endOfWeek, subWeeks, eachDayOfInterval, format } from 'date-fns';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(`[Dashboard] Fetching stats for user: ${userId}`);
    const today = new Date();
    
    // 1. Active Habits Count
    const activeHabitsCount = await prisma.habit.count({
      where: { userId }
    });
    console.log(`[Dashboard] Active habits: ${activeHabitsCount}`);

    // 2. Top Habit (Calculate Streak In-Memory)
    // Fetch all habits with completions to calculate streaks
    const allHabits = await prisma.habit.findMany({
      where: { userId },
      include: {
        completions: {
          orderBy: { completedAt: 'desc' }
        }
      }
    });

    let topHabit = null;
    let maxStreak = -1;

    allHabits.forEach(habit => {
        let currentStreak = 0;
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const sortedCompletions = habit.completions.map(c => {
            const d = new Date(c.completedAt);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }).sort((a, b) => b - a);

        if (sortedCompletions.length > 0) {
            const lastCompletion = sortedCompletions[0];
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastCompletion === now.getTime() || lastCompletion === yesterday.getTime()) {
                currentStreak = 1;
                for (let i = 0; i < sortedCompletions.length - 1; i++) {
                    const current = sortedCompletions[i];
                    const next = sortedCompletions[i + 1];
                    const diffDays = (current - next) / (1000 * 60 * 60 * 24);
                    if (diffDays === 1) currentStreak++;
                    else break;
                }
            }
        }

        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
            topHabit = {
                name: habit.name,
                streak: currentStreak,
                icon: habit.icon
            };
        }
    });

    console.log(`[Dashboard] Top habit: ${topHabit?.name} (${maxStreak})`);


    // 3. Weekly Activity (Last 7 days)
    const end = today;
    const start = subWeeks(today, 1);
    
    // Fix field name: completedAt
    const completions = await prisma.completion.findMany({
      where: {
        habit: { userId },
        completedAt: {
          gte: start,
          lte: end
        }
      }
    });
    console.log(`[Dashboard] Found ${completions.length} completions in range`);

    const days = eachDayOfInterval({ start: subWeeks(today, 1), end: today }).slice(-5); 
    const weeklyActivity = days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const count = completions.filter(c => {
             const d = new Date(c.completedAt); // Fix field name
             const cDate = d.toISOString().split('T')[0];
             return cDate === dateStr;
        }).length;
        
        return {
            label: format(day, 'EEE d'),
            value: count
        };
    });

    // 4. Positive Habits Score
    const startOfCurrentWeek = startOfWeek(today);
    const startOfLastWeek = startOfWeek(subWeeks(today, 1));
    const endOfLastWeek = endOfWeek(subWeeks(today, 1));

    const currentWeekCompletions = await prisma.completion.count({
        where: {
            habit: { userId },
            completedAt: { gte: startOfCurrentWeek } // Fix field name
        }
    });

    const lastWeekCompletions = await prisma.completion.count({
        where: {
            habit: { userId },
            completedAt: { gte: startOfLastWeek, lte: endOfLastWeek } // Fix field name
        }
    });

    let scoreChange = 0;
    if (lastWeekCompletions === 0) {
        scoreChange = currentWeekCompletions > 0 ? 100 : 0;
    } else {
        scoreChange = Math.round(((currentWeekCompletions - lastWeekCompletions) / lastWeekCompletions) * 100);
    }
    
    const stats = {
        activeHabits: activeHabitsCount,
        topHabit: topHabit || { name: 'Start a habit!', streak: 0, icon: '🌱' },
        weeklyActivity,
        scoreChange,
        totalCompletions: await prisma.completion.count({ where: { habit: { userId } } })
    };

    res.json(stats);
  } catch (error) {
    console.error('[Dashboard] Error generation stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
