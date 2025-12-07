import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layout } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import HabitCard from '../components/HabitCard';
import CreateHabitModal from '../components/CreateHabitModal';
import type { Habit } from '../types';

const Dashboard = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHabits = async () => {
    try {
      const response = await api.get('/habits');
      setHabits(response.data.habits || []);
    } catch (error) {
      console.error('Failed to fetch habits', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleCreateHabit = async (data: any) => {
    try {
      await api.post('/habits', data);
      toast.success('Habit created successfully! 🎉');
      fetchHabits(); // Refresh list
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Failed to create habit';
      toast.error(msg);
      throw error; // Let modal handle error state if needed
    }
  };

  const handleCheckIn = async (habitId: number) => {
    // Optimistic update
    const previousHabits = [...habits];
    const today = new Date().toISOString().split('T')[0];

    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const isCompleted = h.completedDates.includes(today);
        if (isCompleted) {
            // Optimistic un-check is tricky without backend support usually, 
            // but let's assume toggle behavior if we had it. 
            // For now, only check-in is supported by backend likely.
            return h; 
        }
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
      fetchHabits(); // Re-fetch to get exact server state
    } catch (error: any) {
      // Revert on failure
      setHabits(previousHabits);
      const msg = error.response?.data?.error || 'Check-in failed';
      toast.error(msg);
    }
  };

  const handleDeleteHabit = async (habitId: number) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;
    
    try {
      await api.delete(`/habits/${habitId}`);
      toast.success('Habit deleted');
      setHabits(habits.filter(h => h.id !== habitId));
    } catch (error) {
      toast.error('Failed to delete habit');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddHabit={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            You have {habits.length} active habits. Let's crush them today!
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100"
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Layout className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Start your journey by creating your first habit. Small steps lead to big changes!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Habit
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onCheckIn={handleCheckIn}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
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
