import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import type { DashboardStats } from '../../types';

interface SidebarProps {
  onNewHabit: () => void;
  stats?: DashboardStats;
}

const Sidebar = ({ onNewHabit, stats }: SidebarProps) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const paddingDays = Array(startDay).fill(null);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          Happy<br />
          <span className="text-gray-400">{format(today, 'EEEE')}</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm">{format(today, 'd MMM yyyy, h:mm a')}</p>
      </div>

      <div className="space-y-3">
        <button 
          onClick={onNewHabit}
          className="w-full py-4 bg-[#FDBA74] hover:bg-[#FB923C] text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm shadow-orange-100"
        >
          <Plus className="w-5 h-5" />
          New Habits
        </button>
        <button className="w-full py-4 bg-white border border-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors">
          Browse Popular Habits
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">{format(today, 'MMMM, yyyy')}</h3>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-gray-100 rounded-full text-gray-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded-full text-orange-400 bg-orange-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-4 mb-2">
          {weekDays.map((day, i) => (
            <div key={`${day}-${i}`} className="text-center text-xs font-medium text-gray-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-4">
          {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
          {daysInMonth.map(day => {
            const isToday = isSameDay(day, today);
            return (
              <div key={day.toISOString()} className="flex justify-center">
                <div className={`
                  w-8 h-8 flex items-center justify-center text-sm rounded-full
                  ${isToday ? 'bg-orange-400 text-white shadow-md shadow-orange-200' : 'text-gray-600 hover:bg-gray-50'}
                `}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>
        
        {stats && (
            <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {stats.scoreChange >= 0 ? '+' : ''}{stats.scoreChange}% completion rate
            </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
