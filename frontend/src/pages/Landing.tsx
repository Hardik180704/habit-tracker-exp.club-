import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart2, Zap } from 'lucide-react';

import ThemeToggle from '../components/ThemeToggle';

import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen lg:h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans overflow-x-hidden lg:overflow-hidden selection:bg-indigo-500/30 transition-colors duration-300 flex flex-col">
      
      {/* Navigation */}
      <nav className="w-full z-50 bg-white/80 dark:bg-black/50 backdrop-blur-lg border-b border-gray-200 dark:border-white/5 transition-colors duration-300 flex-none h-16">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
               <img src="/logo-512.png" alt="Onyx Logo" className="w-7 h-7 rounded-lg" />
               <span className="text-lg font-bold font-['Outfit']">Onyx</span>
            </div>
            <p className="text-[9px] font-extrabold tracking-[0.2em] text-gray-400 dark:text-white/50 mt-0.5 uppercase font-['Outfit'] ml-1">Stay Locked In</p>
          </div>
          <div className="flex items-center gap-3">
             <ThemeToggle />
             <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
             >
                Log In
             </button>
             <button 
                onClick={() => navigate('/register')}
                className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
             >
                Get Started
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 relative flex flex-col justify-center min-h-0">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_#4f46e5_0%,_transparent_60%)] opacity-10 dark:opacity-20 pointer-events-none"></div>
        
        <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center h-full pb-8 lg:pb-8 pt-12 lg:pt-0">
            
            {/* Left Content */}
            <div className="max-w-xl lg:pt-0">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400">v2.0 Now Live</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
                    Automate your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Productivity</span> <br/>
                    with Systems.
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-md">
                    Motivation fades. Systems don't. Build unstoppable habits, track your life with precision, and stay locked in with Onyx.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                    <button 
                        onClick={() => navigate('/register')}
                        className="h-12 px-6 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full text-base flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                    >
                        Reinvent Yourself <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                         onClick={() => navigate('/login')}
                         className="h-12 px-6 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold rounded-full text-base flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                    >
                        View Demo
                    </button>
                </div>

                 {/* Feature Bullets - Compact */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                            <BarChart2 className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Precision Analytics</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Dopamine Hooks</h3>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Right Image Showcase */}
            <div className="relative h-full lg:max-h-[500px] min-h-[300px] flex items-center justify-center lg:pb-0">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-indigo-500 blur-[100px] opacity-10 dark:opacity-20"></div>
                
                <div className="relative w-full max-w-[550px] rounded-2xl p-1.5 bg-gradient-to-b from-white/50 to-white/20 dark:from-white/10 dark:to-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl transform rotate-y-12 rotate-x-6 perspective-1000 transition-transform hover:scale-[1.02] duration-500">
                    <img 
                        src={theme === 'dark' ? "/dashboard-preview.png" : "/dashboard-light-preview.png"} 
                        alt="Onyx Dashboard" 
                        className="rounded-lg w-full h-auto shadow-inner border border-gray-200 dark:border-white/5 transition-opacity duration-300"
                    />
                    
                    {/* Floating Badge */}
                    <div className="absolute -bottom-4 -left-4 bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#333] p-3 rounded-xl shadow-xl dark:shadow-2xl flex items-center gap-3 scale-90 origin-bottom-left">
                         <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white dark:border-[#1A1A1A]"></div>
                            <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white dark:border-[#1A1A1A]"></div>
                            <div className="w-6 h-6 rounded-full bg-pink-500 border-2 border-white dark:border-[#1A1A1A]"></div>
                         </div>
                         <div>
                             <p className="text-[10px] font-bold text-gray-900 dark:text-white">Join 2,000+ Achievers</p>
                             <p className="text-[9px] text-gray-500 dark:text-gray-400">Tracking daily wins</p>
                         </div>
                    </div>
                </div>
            </div>

        </div>
      </div>

      {/* Premium Marquee - Footer Fixed */}
      <div className="flex-none py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden relative">
         <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-black to-transparent z-10"></div>
         <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-black to-transparent z-10"></div>
         
         <div className="flex w-[200%] animate-scroll hover:[animation-play-state:paused] items-center">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center justify-around w-full gap-12 px-4">
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">Habit Tracking</span>
                    
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 14.52 1.141.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-800 dark:text-white whitespace-nowrap">Spotify Sync</span>
                    </div>

                    <span className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">Analytics</span>

                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-black dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                        </svg>
                        <span className="text-xs font-bold tracking-widest uppercase text-gray-800 dark:text-white whitespace-nowrap">Notion Integration</span>
                    </div>

                    <span className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">Gamification</span>
                    <span className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 whitespace-nowrap">Streak Protection</span>
                </div>
            ))}
         </div>
      </div>
      
    </div>
  );
};

export default Landing;
