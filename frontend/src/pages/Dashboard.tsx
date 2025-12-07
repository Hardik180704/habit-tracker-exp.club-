import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CreateHabitModal from '../components/CreateHabitModal';
import Sidebar from '../components/dashboard/Sidebar';
import WeatherCard from '../components/dashboard/WeatherCard';
import TodoListWidget from '../components/dashboard/TodoListWidget';
import { SpotifyCard, MoreIntegrationsCard } from '../components/dashboard/IntegrationCards';
import { AnalyticsStats, HabitsWrapped, RunningCompetition, FavoriteHabitsChart, ShouldDoWidget, ClubWidget } from '../components/dashboard/AnalyticsWidgets';
import type { Habit, DashboardStats } from '../types';

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<DashboardStats | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [habitsRes, statsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/dashboard/stats')
      ]);
      
      setHabits(habitsRes.data.habits || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateHabit = async (data: any) => {
    try {
      await api.post('/habits', data);
      toast.success('Habit created successfully! 🎉');
      fetchData(); 
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Failed to create habit';
      toast.error(msg);
      throw error; 
    }
  };

  const handleCheckIn = async (habitId: number) => {
    const previousHabits = [...habits];
    const today = new Date().toISOString().split('T')[0];

    // Optimistic update
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        if (h.completedDates.includes(today)) return h; // Already done
        return {
          ...h,
          completedDates: [...h.completedDates, today],
          streak: h.streak + 1,
          totalCompletions: h.totalCompletions + 1
        };
      }
      return h;
    }));

    try {
      await api.post(`/habits/${habitId}/checkin`, { date: today });
      toast.success('Great job! Keep it up! 🔥', { id: 'checkin-success' });
      // Background refresh stats for accurate data
      const statsRes = await api.get('/dashboard/stats');
      setStats(statsRes.data);
    } catch (error: any) {
      setHabits(previousHabits);
      const msg = error.response?.data?.error || 'Check-in failed';
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <Navbar onAddHabit={() => setIsModalOpen(true)} />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
            {/* Left Column: Sidebar (3 cols) */}
            <div className="lg:col-span-3">
                <Sidebar onNewHabit={() => setIsModalOpen(true)} stats={stats} />
            </div>

            {/* Middle Column: Visual Widgets (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
                <div className="flex justify-between items-end">
                    <h3 className="font-bold text-lg">Weather</h3>
                    <span className="text-xs text-gray-500 cursor-pointer">View Details</span>
                </div>
                <WeatherCard />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-4">
                         <h3 className="font-bold text-lg">My Focus</h3>
                         <ShouldDoWidget stats={stats} />
                         <ClubWidget />
                     </div>
                     <div className="space-y-4 pt-10 sm:pt-0">
                         {/* Spacer for visual alignment or more widgets */}
                     </div>
                </div>

                <div className="pt-2">
                    <RunningCompetition />
                </div>
            </div>

            {/* Right Column: List & Stats (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
                 <div className="h-[400px]">
                    <TodoListWidget 
                        habits={habits}
                        onCheckIn={handleCheckIn}
                        onNewHabit={() => setIsModalOpen(true)}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4 h-48">
                     <AnalyticsStats stats={stats} />
                     <HabitsWrapped />
                 </div>

                 <div className="grid grid-cols-2 gap-4 h-40">
                     <SpotifyCard />
                     <MoreIntegrationsCard />
                 </div>

                 <div className="pt-2">
                     <FavoriteHabitsChart stats={stats} />
                 </div>
            </div>
        </motion.div>
      </main>

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateHabit}
      />
    </div>
  );
};

export default Dashboard;
