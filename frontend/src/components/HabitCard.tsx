import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, MoreVertical, Trash2 } from 'lucide-react';
import type { Habit } from '../types';
import { format } from 'date-fns';

interface HabitCardProps {
  habit: Habit;
  onCheckIn: (id: number) => void;
  // onEdit?: (habit: Habit) => void;
  onDelete: (id: number) => void;
}

const HabitCard = ({ habit, onCheckIn, onDelete }: HabitCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompletedToday = habit.completedDates.includes(today);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm relative group overflow-visible"
    >
      {/* Decorative background blob */}
      <div 
        className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-colors duration-500 pointer-events-none`}
        style={{ backgroundColor: habit.color || '#4F46E5' }}
      />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ backgroundColor: habit.color || '#4F46E5' }}
          >
            <span className="text-xl">{habit.icon || '📝'}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">{habit.name}</h3>
            <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mt-1">
              {habit.frequency} • {habit.category}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-300 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-8 w-32 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
              >
                <div className="py-1">
                  {/* Edit placeholder
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  */}
                  <button 
                    onClick={() => {
                      onDelete(habit.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-end justify-between relative z-10 mt-6">
        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="text-sm font-bold text-orange-700">{habit.streak} Day Streak</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onCheckIn(habit.id)}
          className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-300 ${
            isCompletedToday
              ? 'bg-green-500 border-green-500 text-white shadow-green-200 shadow-lg'
              : 'bg-white border-gray-200 text-gray-300 hover:border-gray-300 hover:text-gray-400'
          }`}
        >
          <Check className={`w-6 h-6 ${isCompletedToday ? 'stroke-[3px]' : ''}`} />
        </motion.button>
      </div>
      
      {/* Description tooltip or footer could go here */}
      {habit.description && (
        <p className="mt-4 text-sm text-gray-400 line-clamp-2 border-t border-gray-50 pt-3">
          {habit.description}
        </p>
      )}
    </motion.div>
  );
};

export default HabitCard;
