import { Plus, ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';

interface SidebarProps {
  onNewHabit: () => void;
}

const Sidebar = ({ onNewHabit }: SidebarProps) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const paddingDays = Array(startDay).fill(null);
  
  // Combine for single grid iteration
  const days = [...paddingDays, ...daysInMonth];

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-white rounded-3xl p-6 h-full flex flex-col border border-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors">
      
      {/* Date Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1 dark:text-white">Happy</h1>
        <h2 className="text-3xl font-bold text-gray-400 mb-2 dark:text-gray-500">{format(today, 'EEEE')}</h2>
        <p className="text-sm text-gray-500 font-medium dark:text-gray-400">
          {format(today, 'd MMM yyyy, h:mm a')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mb-8">
        <button 
            onClick={onNewHabit}
            className="w-full py-3 bg-orange-300 hover:bg-orange-400 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-100 dark:shadow-none"
        >
          <Plus className="w-5 h-5" />
          New Habits
        </button>
        <button className="w-full py-3 bg-white border border-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
          Browse Popular Habits
        </button>
      </div>

      {/* Daily Insight Strategy */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 flex-1 flex flex-col justify-center mb-4 relative overflow-hidden group">
         <div className="absolute -right-4 -top-4 text-indigo-100 group-hover:text-indigo-200 transition-colors rotate-12">
             <Quote size={80} />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                 <div className="p-1.5 bg-white/60 backdrop-blur-sm rounded-lg">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                 </div>
                 <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Daily Wisdom</span>
            </div>
            <p className="text-sm text-gray-700 font-medium leading-relaxed italic">
                "Success is the sum of small efforts, repeated day in and day out."
            </p>
            <p className="text-xs text-gray-400 mt-2 font-medium">— Robert Collier</p>
         </div>
      </div>
      
      {/* Calendar */}
      <div className="mb-0">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{format(today, 'MMMM, yyyy')}</h3>
            <div className="flex gap-1">
                <button className="p-1 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 dark:text-gray-300">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-700 dark:text-gray-300">
                    <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {['S','M','T','W','T','F','S'].map(d => (
                <div key={d} className="text-gray-400 font-medium dark:text-gray-500">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-sm">
             {days.map((day, i) => {
                 const isTodayLink = day && isSameDay(day, today); // Check if day is not null (for padding days)
                 return (
                     <div key={i} className={`
                        py-1.5 rounded-lg font-medium text-xs
                        ${day ? (isTodayLink ? 'bg-orange-400 text-white shadow-md shadow-orange-200' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700') : ''}
                     `}>
                         {day ? format(day, 'd') : ''}
                     </div>
                 )
             })}
          </div>
      </div>

    </div>
  );
};

export default Sidebar;
