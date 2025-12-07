import { ChevronDown, Gift, ArrowUpRight, ChevronRight, Flame } from 'lucide-react';
import type { DashboardStats } from '../../types';
import { useState, useEffect, memo } from 'react';
import api from '../../services/api';

interface AnalyticsProps {
    stats?: DashboardStats;
}

export const AnalyticsStats = memo(({ stats }: AnalyticsProps) => {
  const score = stats?.scoreChange ?? 0;
  const isPositive = score >= 0;

  return (
    <div className="bg-[#4E684D] rounded-3xl p-6 text-white relative overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-6 -mt-6" />
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
          <div className="text-xl">😎</div>
        </div>
        
        <div>
          <p className="text-white/80 text-xs font-medium mb-1">Weekly Growth</p>
          <h3 className="text-3xl font-bold">
            {isPositive ? '+' : ''}{score}%
          </h3>
        </div>
      </div>
    </div>
  );
});

export const HabitsWrapped = memo(({ onView }: { onView?: () => void }) => {
  return (
    <div className="bg-[#1C1C1E] rounded-3xl p-6 text-white text-center relative overflow-hidden h-full flex flex-col justify-between">
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
      </div>

      <div className="relative z-10 flex flex-col items-center flex-1 justify-center">
        <div className="w-12 h-12 bg-red-500 rounded-2xl rotate-12 flex items-center justify-center shadow-lg mb-4">
          <Gift className="w-6 h-6 text-white" />
        </div>
        
        <p className="text-gray-400 text-xs font-medium">Habits<br/>Wrapped</p>
        <h3 className="text-2xl font-bold mt-1">{new Date().getFullYear()}</h3>
      </div>

      <button 
        onClick={onView}
        className="relative z-10 w-full py-2 bg-white text-black text-xs font-bold rounded-lg mt-4 hover:bg-gray-100 transition-colors"
      >
        View
      </button>
    </div>
  );
});

export const RunningCompetition = memo(() => {
    const [stats, setStats] = useState({ found: false, miles: 0, targetMiles: 20, daysLeft: 0, habitName: '' });
    
    useEffect(() => {
        const fetchRunningStats = async () => {
            try {
                const res = await api.get('/dashboard/stats/running');
                setStats(res.data);
            } catch {
                console.error('Failed to fetch running stats');
            }
        };
        fetchRunningStats();
    }, []);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 relative overflow-hidden dark:bg-gray-800 dark:border-gray-700 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Running Competition</h3>
                {stats.found ? (
                    <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">📅 {stats.daysLeft} days left</span>
                        <span className="flex items-center gap-1">🎯 {stats.targetMiles} miles goal</span>
                    </div>
                ) : (
                    <p className="text-xs text-orange-500 mt-1">Create a "Run" habit to join!</p>
                )}
            </div>
            <button className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-200 dark:shadow-none">
                <ArrowUpRight className="w-5 h-5" />
            </button>
        </div>
        
        <div className="h-32 bg-gray-100 rounded-2xl relative overflow-hidden dark:bg-gray-700">
            {/* Map Background - Replaced expensive external image with static gradient */}
            <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-800"></div>
            
            {/* Progress Path Visualization */}
            <div className="absolute bottom-4 left-4 right-4">
                 <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-600 dark:text-gray-300">{stats.miles}mi</span>
                    <span className="text-gray-400">{stats.targetMiles}mi</span>
                 </div>
                 <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min((stats.miles / stats.targetMiles) * 100, 100)}%` }}
                    ></div>
                 </div>
            </div>

             {/* Runner Icon */}
             {stats.found && (
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex flex-col items-center animate-bounce">
                        <span className="text-2xl">🏃</span>
                        <div className="w-8 h-1 bg-black/20 rounded-full"></div>
                    </div>
                 </div>
             )}
        </div>
    </div>
  );
});

// 1. Should Do Widget (Suggests a habit to focus on)
export const ShouldDoWidget = memo(({ stats }: AnalyticsProps) => {
    const topHabit = stats?.topHabit;

  return (
    <div className="flex items-center gap-3 group cursor-pointer">
       <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl shadow-sm group-hover:bg-orange-100 transition-colors dark:bg-orange-900/30 dark:group-hover:bg-orange-900/50">
           {topHabit?.icon || '💧'}
       </div>
       <div className="flex-1">
           <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{topHabit?.name || 'Start a habit!'}</h4>
           <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 font-medium">{topHabit?.streak ? `${topHabit.streak} day streak` : 'No activity yet'}</span>
                {topHabit?.streak && <Flame className="w-3 h-3 text-orange-500" />}
           </div>
       </div>
       <button className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-orange-500 dark:group-hover:text-white">
            <ChevronRight className="w-4 h-4" />
       </button>
    </div>
  );
});

// 2. 5am Club / Community Widget
export const ClubWidget = memo(() => {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
       <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl shadow-sm group-hover:bg-red-100 transition-colors dark:bg-red-900/30 dark:group-hover:bg-red-900/50">
           ⏰
       </div>
       <div className="flex-1">
           <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">The 5am club</h4>
           <p className="text-[10px] text-gray-400 font-medium">5.4k love this</p>
       </div>
       <button className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-300 group-hover:bg-red-500 group-hover:text-white transition-all dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-red-500 dark:group-hover:text-white">
            <ChevronRight className="w-4 h-4" />
       </button>
    </div>
  );
});

// 3. Activity / Favorite Habits Chart (Bottom Right)
export const FavoriteHabitsChart = memo(({ stats }: AnalyticsProps) => {
    const data = stats?.weeklyActivity || [];
    
    // Generate last 7 days with 0 values if no data exists
    const displayData = data.length > 0 ? data : Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            label: d.toLocaleDateString('en-US', { weekday: 'short' }),
            value: 0
        };
    });

    const maxVal = Math.max(...displayData.map(d => d.value)) || 8;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col dark:bg-gray-800 dark:border-gray-700 transition-colors">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="font-bold text-gray-900 text-lg dark:text-white">Activity</h3>
            <p className="text-xs text-gray-400 font-medium">Weekly completions</p>
        </div>
        <div className="flex gap-2">
             <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                <ChevronDown className="w-4 h-4 rotate-180" />
             </button>
             <button className="px-3 py-1 bg-black text-white rounded-full text-xs font-bold dark:bg-white dark:text-black">
                Week
             </button>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-3 px-2">
         {displayData.map((d, i) => {
             const height = (d.value / maxVal) * 100;
             const isToday = i === displayData.length - 1;
             // Use "premium" aesthetic: dark gray for past, orange/gradient for focus
             const barColor = isToday ? 'bg-gradient-to-t from-orange-400 to-orange-300' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600';
             const textColor = isToday ? 'text-orange-500 font-bold' : 'text-gray-400';

             return (
                 <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer relative">
                     {/* Tooltip on hover */}
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 dark:bg-white dark:text-black">
                        {d.value} habits
                     </div>

                     <div 
                        className={`w-full max-w-[24px] rounded-full transition-all duration-500 relative ${barColor}`} 
                        style={{ height: `${Math.max(height, 8)}%` }} // min height for visibility
                     >
                     </div>
                     <span className={`text-[10px] mt-3 ${textColor} transition-colors`}>{d.label}</span>
                 </div>
             )
         })}
      </div>
    </div>
  );
});
