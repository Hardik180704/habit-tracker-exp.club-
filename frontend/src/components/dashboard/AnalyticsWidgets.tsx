import { ChevronDown, Gift, ArrowUpRight } from 'lucide-react';
import type { DashboardStats } from '../../types';

interface AnalyticsProps {
    stats?: DashboardStats;
}

export const AnalyticsStats = ({ stats }: AnalyticsProps) => {
  const score = stats?.scoreChange ?? 0;
  const isPositive = score >= 0;

  return (
    <div className="bg-[#4E684D] rounded-3xl p-6 text-white relative overflow-hidden h-full">
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
};

export const HabitsWrapped = () => {
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
        <h3 className="text-2xl font-bold mt-1">2024</h3>
      </div>

      <button className="relative z-10 w-full py-2 bg-white text-black text-xs font-bold rounded-lg mt-4 hover:bg-gray-100 transition-colors">
        View
      </button>
    </div>
  );
};

export const RunningCompetition = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-bold text-gray-900">Running Competition</h3>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">📅 31 Dec</span>
                    <span className="flex items-center gap-1">🎯 20miles</span>
                </div>
            </div>
            <button className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white hover:bg-orange-500 transition-colors shadow-lg shadow-orange-200">
                <ArrowUpRight className="w-5 h-5" />
            </button>
        </div>
        
        <div className="h-32 bg-gray-100 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,2/300x200?access_token=mock')] bg-cover"></div>
            <svg className="absolute inset-0 w-full h-full text-blue-400 stroke-current stroke-[4] fill-none" viewBox="0 0 100 50" preserveAspectRatio="none">
                <path d="M10,40 Q30,10 50,30 T90,20" />
            </svg>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-md"></div>
             </div>
        </div>
    </div>
  );
};

export const FavoriteHabitsChart = ({ stats }: AnalyticsProps) => {
    const data = stats?.weeklyActivity || [];
    
    // Fallback Mock Data if empty
    const displayData = data.length > 0 ? data : [
        { label: 'Fri', value: 3 },
        { label: 'Sat', value: 5 },
        { label: 'Sun', value: 2 },
        { label: 'Mon', value: 4 },
        { label: 'Tue', value: 6 }
    ];

    const maxVal = Math.max(...displayData.map(d => d.value)) || 1;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">Activity</h3>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600">
            Last 7 Days <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-end justify-between h-40 gap-2">
         {displayData.map((d, i) => {
             const height = (d.value / maxVal) * 100;
             const isToday = i === displayData.length - 1;
             
             return (
                 <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                     {isToday && (
                         <div className="mb-1 text-center animate-bounce">
                             <span className="text-xs font-bold block">{d.value}</span>
                         </div>
                     )}
                     <div 
                        className={`w-full rounded-t-xl transition-all duration-500 relative overflow-hidden ${isToday ? 'bg-orange-300' : 'bg-gray-100 group-hover:bg-gray-200'}`} 
                        style={{ height: `${height || 10}%` }}
                     >
                        {/* Striped pattern overlay */}
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 50%, #ffffff 50%, #ffffff 75%, transparent 75%, transparent)', backgroundSize: '8px 8px' }}></div>
                     </div>
                 </div>
             )
         })}
      </div>
       <div className="flex justify-between mt-2 px-2">
         {displayData.map((d, i) => (
             <span key={i} className="text-[10px] text-gray-400 font-medium truncate w-8 text-center">{d.label}</span>
         ))}
       </div>
    </div>
  );
};

export const ShouldDoWidget = ({ stats }: AnalyticsProps) => {
    const topHabit = stats?.topHabit;

    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
                <span className="text-2xl">{topHabit?.icon || '💪'}</span>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{topHabit?.name || 'Start a habit!'}</h4>
                    <p className="text-xs text-gray-400">
                        {topHabit?.streak ? `${topHabit.streak} day streak 🔥` : 'Go for it!'}
                    </p>
                </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 group-hover:bg-orange-100 transition-colors">
                <ChevronDown className="w-4 h-4 -rotate-90" />
            </div>
        </div>
    );
};

export const ClubWidget = () => {
    return (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">The 5am club</h4>
                    <p className="text-xs text-gray-400">5.4k love this</p>
                </div>
            </div>
             <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 group-hover:bg-red-100 transition-colors">
                <ChevronDown className="w-4 h-4 -rotate-90" />
            </div>
        </div>
    );
};
