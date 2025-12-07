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

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Today's Todos</h3>
                <button className="text-xs font-semibold text-gray-500 hover:text-gray-900">View Details</button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 {/* Add New Placeholder/Button inside list if empty */}
                 {habits.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-2xl">
                        <p className="text-gray-400 text-sm mb-3">No habits for today</p>
                        <button onClick={onNewHabit} className="text-orange-500 text-sm font-bold hover:underline">
                            + Add Habit
                        </button>
                    </div>
                )}

                {habits.map((habit) => {
                    const isCompleted = habit.completedDates.includes(today);
                    const mock = getMockDetails(habit.id);

                    return (
                        <div key={habit.id} className="group flex items-start gap-4 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                            {/* Icon Box */}
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-sm border border-gray-100 shrink-0 group-hover:bg-white group-hover:shadow-md transition-all">
                                {habit.icon || '📝'}
                            </div>

                            <div className="flex-1 min-w-0 pt-1">
                                <h4 className={`font-bold text-gray-900 truncate ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                                    {habit.name}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {mock.time}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {mock.loc}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => onCheckIn(habit.id)}
                                disabled={isCompleted}
                                className={`
                                    w-8 h-8 rounded-lg flex items-center justify-center transition-all mt-1
                                    ${isCompleted 
                                        ? 'bg-green-500 text-white shadow-green-200 shadow-lg' 
                                        : 'bg-gray-100 text-gray-300 hover:bg-green-100 hover:text-green-500'
                                    }
                                `}
                            >
                                <Check className="w-5 h-5" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TodoListWidget;
