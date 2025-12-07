import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Sparkles, Trophy, Flame } from 'lucide-react';
import type { DashboardStats } from '../../types';

interface WrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats?: DashboardStats;
}

const WrappedModal = ({ isOpen, onClose, stats }: WrappedModalProps) => {
  if (!isOpen) return null;

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
           variants={containerVariants}
           initial="hidden"
           animate="visible"
           exit="exit"
           className="relative w-full max-w-lg bg-[#09090b] text-white rounded-[32px] overflow-hidden border border-white/5 shadow-2xl"
        >
           {/* Close Button */}
           <button 
             onClick={onClose}
             className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20 text-gray-400 hover:text-white"
           >
             <X className="w-5 h-5" />
           </button>

           <div className="p-8 relative z-10">
              {/* Header */}
              <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3 h-3" />
                    Year in Review
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight mb-2">{new Date().getFullYear()} Wrapped</h2>
                  <p className="text-gray-400">Your journey in numbers.</p>
              </div>

              {/* Bento Grid Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                  {/* Total Completions - Large Card */}
                  <div className="col-span-2 bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.07] transition-colors">
                      <div>
                          <p className="text-sm text-gray-400 font-medium mb-1">Total Habits Completed</p>
                          <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            {stats?.totalCompletions || 0}
                          </h3>
                      </div>
                      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                          <Trophy className="w-6 h-6 text-white" />
                      </div>
                  </div>

                  {/* Best Streak */}
                  <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col justify-between aspect-square hover:bg-white/[0.07] transition-colors">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mb-4">
                          <Flame className="w-5 h-5" />
                      </div>
                      <div>
                          <h3 className="text-3xl font-bold">{stats?.topHabit?.streak || 0}</h3>
                          <p className="text-xs text-gray-500 font-medium mt-1">Longest Streak</p>
                      </div>
                  </div>

                  {/* Top Habit */}
                  <div className="bg-white/5 p-5 rounded-3xl border border-white/5 flex flex-col justify-between aspect-square hover:bg-white/[0.07] transition-colors">
                      <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-2xl mb-4">
                          {stats?.topHabit?.icon || '⭐'}
                      </div>
                      <div>
                          <h3 className="text-lg font-bold leading-tight line-clamp-2">{stats?.topHabit?.name || 'Start a habit'}</h3>
                          <p className="text-xs text-gray-500 font-medium mt-1">Top Active Habit</p>
                      </div>
                  </div>
              </div>

              {/* Share/Close Action */}
              <button
                onClick={onClose}
                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/5"
              >
                  Close Summary
              </button>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WrappedModal;
