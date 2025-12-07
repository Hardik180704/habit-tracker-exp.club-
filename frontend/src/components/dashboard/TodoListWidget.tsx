import { Clock, MapPin, Check } from 'lucide-react';
import type { Habit } from '../../types';

interface TodoListWidgetProps {
    habits: Habit[];
    onCheckIn: (id: number) => void;
    onNewHabit: () => void;
}

const TodoListWidget = ({ habits, onCheckIn, onNewHabit }: TodoListWidgetProps) => {
    // Group logic or just list them. The design shows a list with icons.
    // We will map our habits to this design.
    
    // Helper to get random time/location mocks since our backend doesn't have them yet
    const getMockDetails = (id: number) => {
        const times = ['10:00am', '02:00pm', '08:30am', '08:00am', '06:00am'];
        const locs = ['K-Cafe', 'Hayday Market', 'Home', 'Library', 'Gym Pool'];
        return {
            time: times[id % times.length],
            loc: locs[id % locs.length]
        };
    };

    const today = new Date().toISOString().split('T')[0];

    // Assuming 'todayHabits' is meant to be 'habits' from props,
    // and 'Tag' icon is not imported, so replacing with MapPin for now.
    // Also, the mock time is hardcoded in the new snippet, so I'll use that.
    // The new snippet also removes the onNewHabit button for empty state.
    const todayHabits = habits; // Using habits from props as todayHabits

    return (
        <div className="h-full flex flex-col p-6 bg-white dark:bg-gray-800 transition-colors">
      <div className="flex justify-between items-center mb-6">
         <h3 className="font-bold text-xl text-gray-900 dark:text-white">Today's Todos</h3>
         <button className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">View Details</button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
         {todayHabits.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-60">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-700">
                     <Check className="w-6 h-6" />
                 </div>
                 <p className="text-sm font-medium">All caught up!</p>
             </div>
         ) : (
             todayHabits.map(habit => {
                 const isCompleted = habit.completedDates.includes(today);
                 return (
                    <div key={habit.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 dark:hover:bg-gray-700/50 dark:hover:border-gray-700">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shadow-sm dark:bg-gray-700">
                                {habit.icon || '📝'}
                            </div>
                            <div>
                                <h4 className={`font-bold text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {habit.name}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        08:00am
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                        <MapPin className="w-3 h-3" /> {/* Replaced Tag with MapPin as Tag is not imported */}
                                        {habit.category}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => onCheckIn(habit.id)}
                            disabled={isCompleted}
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center transition-all
                                ${isCompleted 
                                    ? 'bg-green-500 text-white shadow-lg shadow-green-200 dark:shadow-none' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-green-500 hover:text-white dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-green-500 dark:hover:text-white'
                                }
                            `}
                        >
                            <Check className="w-4 h-4 font-bold" />
                        </button>
                    </div>
                 )
             })
         )}
      </div>
    </div>
    );
};

export default TodoListWidget;
