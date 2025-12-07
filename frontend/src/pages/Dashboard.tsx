import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import CreateHabitModal from '../components/CreateHabitModal';
import Sidebar from '../components/dashboard/Sidebar';
import WeatherCard from '../components/dashboard/WeatherCard';
import TodoListWidget from '../components/dashboard/TodoListWidget';
import { SpotifyCard, NotionCard } from '../components/dashboard/IntegrationCards';
import { AnalyticsStats, HabitsWrapped, RunningCompetition, FavoriteHabitsChart, ShouldDoWidget, ClubWidget } from '../components/dashboard/AnalyticsWidgets';
import WrappedModal from '../components/dashboard/WrappedModal';
import type { Habit, DashboardStats } from '../types';

const Dashboard = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<DashboardStats | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWrappedOpen, setIsWrappedOpen] = useState(false);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [habitsRes, statsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/dashboard/stats')
      ]);
      
      setHabits(habitsRes.data.habits || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      if (!silent) toast.error('Failed to load dashboard');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Poll every 5 seconds
    const intervalId = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(intervalId);
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
    <div className="min-h-screen bg-gray-50 pb-8 dark:bg-gray-900 transition-colors">
      <Navbar onAddHabit={() => setIsModalOpen(true)} />

      <main className="max-w-[1700px] mx-auto px-6 h-[calc(100vh-2rem)] min-h-[850px] overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
        <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-12 gap-5 h-full"
        >
            {/* COLUMN 1: SIDEBAR (3 cols) */}
            <div className="col-span-3 h-full">
                <Sidebar onNewHabit={() => setIsModalOpen(true)} />
            </div>

            {/* COLUMN 2: WIDGETS LEFT (3 cols) */}
            <div className="col-span-3 flex flex-col gap-5 h-full">
                {/* Weather */}
                <div className="flex-[3] shrink-0 min-h-0">
                    <WeatherCard />
                </div>
                
                {/* Stacked Focus Widgets */}
                <div className="flex-[4] flex flex-col gap-4 min-h-0">
                     <div className="flex-1 bg-white rounded-3xl p-5 border border-gray-100 flex flex-col justify-center min-h-0 dark:bg-gray-800 dark:border-gray-700 transition-colors">
                         <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Should Do!</h3>
                         <ShouldDoWidget stats={stats} />
                     </div>
                     <div className="flex-1 bg-white rounded-3xl p-5 border border-gray-100 flex flex-col justify-center min-h-0 dark:bg-gray-800 dark:border-gray-700 transition-colors">
                         <ClubWidget />
                     </div>
                </div>

                {/* Running Map */}
                <div className="flex-[3] min-h-0">
                    <RunningCompetition />
                </div>
            </div>

            {/* COLUMN 3: TODOS & ANALYTICS (3 cols) */}
            <div className="col-span-3 flex flex-col gap-5 h-full">
                 {/* Todo List - Big chunk */}
                 <div className="flex-[6] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-0 dark:bg-gray-800 dark:border-gray-700 transition-colors">
                    <TodoListWidget 
                        habits={habits}
                        onCheckIn={handleCheckIn}
                        onNewHabit={() => setIsModalOpen(true)}
                    />
                 </div>

                 {/* Analytics & Wrapped */}
                 <div className="flex-[4] flex flex-col min-h-0 gap-2">
                     <h3 className="font-bold text-lg dark:text-white">Analytics</h3>
                     <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                        <AnalyticsStats stats={stats} />
                        <HabitsWrapped onView={() => setIsWrappedOpen(true)} />
                     </div>
                 </div>
            </div>

            {/* COLUMN 4: MUSIC & CHARTS (3 cols) */}
            <div className="col-span-3 flex flex-col gap-5 h-full">
                 {/* Spotify */}
                 <div className="flex-[3] min-h-0">
                     <SpotifyCard />
                 </div>

                 {/* Integrations (Notion Card) */}
                 <div className="flex-[3] min-h-0">
                     <NotionCard />
                 </div>
                 
                 {/* Favorite Habits Chart */}
                 <div className="flex-[3] min-h-0">
                     <div className="h-full w-full flex flex-col">
                        <FavoriteHabitsChart stats={stats} />
                     </div>
                 </div>
            </div>
        </motion.div>
      </main>

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateHabit}
      />
      
      <WrappedModal 
        isOpen={isWrappedOpen}
        onClose={() => setIsWrappedOpen(false)}
        stats={stats}
      />
    </div>
  );
};

export default Dashboard;
