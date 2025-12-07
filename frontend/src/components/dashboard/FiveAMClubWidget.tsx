import { useState, useEffect, memo } from 'react';
import { Sunrise, Users } from 'lucide-react';
import api from '../../services/api';

interface Member {
    id: number;
    username: string;
    avatar: string;
    isMe: boolean;
}

interface FiveAMStats {
    members: Member[];
    count: number;
    joined: boolean;
}

const FiveAMClubWidget = memo(() => {
    const [stats, setStats] = useState<FiveAMStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/dashboard/stats/5am-club');
                setStats(res.data);
            } catch (error) {
                console.error('Failed to load 5AM stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 rounded-3xl p-6 h-full flex items-center justify-center animate-pulse border border-orange-100 dark:border-orange-800/30">
                <Sunrise className="w-8 h-8 text-orange-300" />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 rounded-3xl p-6 h-full relative overflow-hidden flex flex-col">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sunrise className="w-24 h-24 text-orange-500" />
            </div>

            <div className="relative z-10 flex-shrink-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-white/60 dark:bg-black/20 rounded-lg">
                        <Sunrise className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">5AM Club</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 leading-tight">
                    {stats?.joined ? "You're in the club! ☀️" : "Wake up with friends"}
                </h3>
            </div>

            <div className="relative z-10 mt-4 flex-1 flex flex-col justify-center min-h-0">
                {stats && stats.count > 0 ? (
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {stats.members.slice(0, 3).map((member) => (
                                <div key={member.id} className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-800 bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-xs font-bold text-orange-700 dark:text-orange-300" title={member.username}>
                                    {member.avatar}
                                </div>
                            ))}
                            {stats.count > 3 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-800 bg-orange-50 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold text-orange-400">
                                    +{stats.count - 3}
                                </div>
                            )}
                        </div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            <span className="font-bold text-gray-900 dark:text-white">{stats.count}</span> confirmed today
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>Be the first to join today!</span>
                    </div>
                )}
            </div>

            <div className="relative z-10 mt-auto pt-4 w-full">
                {stats?.joined ? (
                     <div className="w-full py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                         <span>✓ Checked in</span>
                     </div>
                ) : (
                    <button 
                        disabled={true} 
                        className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                        <span>I'm Awake!</span>
                        <span className="font-normal opacity-80">(4:00-5:05 AM)</span>
                    </button>
                )}
            </div>
        </div>
    );
});

export default FiveAMClubWidget;
