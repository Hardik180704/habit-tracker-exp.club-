import { useState } from 'react';
import { Play, SkipForward, SkipBack, Heart } from 'lucide-react';

export const SpotifyCard = () => {
  const [isConnected, setIsConnected] = useState(false);

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gradient-to-br dark:from-[#121212] dark:to-[#1E1E1E] rounded-3xl p-5 text-gray-900 dark:text-white h-full relative overflow-hidden group border border-gray-100 dark:border-white/5 flex flex-col justify-between shadow-lg transition-colors">
         {/* Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#1DB954] rounded-full blur-[90px] opacity-5 dark:opacity-10 pointer-events-none"></div>

         <div className="flex flex-col items-center justify-center h-full z-10 gap-4">
            <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-[#1DB954]/20 group-hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white dark:text-black">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
            </div>
            
            <div className="text-center">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Spotify</h3>
                <p className="text-xs text-gray-500 dark:text-white/50 px-2 mt-1">Control your music directly from your dashboard</p>
            </div>

            <button 
                onClick={() => setIsConnected(true)}
                className="w-full py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white dark:text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-[#1DB954]/20 mt-2"
            >
                Link Account
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-[#121212] dark:to-[#1E1E1E] rounded-3xl p-5 text-gray-900 dark:text-white h-full relative overflow-hidden group border border-gray-100 dark:border-white/5 flex flex-col justify-between shadow-lg transition-colors">
       
       {/* Background Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#1DB954] rounded-full blur-[80px] opacity-10 dark:opacity-20 pointer-events-none"></div>

       {/* Header with Logo */}
       <div className="flex justify-between items-start mb-2 z-10">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                {/* Official Spotify Icon SVG */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#1DB954]">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
             </div>
             <span className="font-bold text-xs tracking-wider opacity-80 uppercase">Now Playing</span>
          </div>
          <button className="text-gray-400 hover:text-[#1DB954] dark:text-white/50 dark:hover:text-[#1DB954] transition-colors">
             <Heart className="w-4 h-4" />
          </button>
       </div>
       
       {/* Album Art & Track Info */}
       <div className="flex items-center gap-4 z-10 mt-auto">
          {/* Mock Album Art with spinning animation suggestion */}
          <div className="w-14 h-14 rounded-lg bg-gradient-to-tr from-gray-700 to-gray-500 shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
             <div className="absolute inset-0 bg-black/10"></div>
             {/* Mock visualizer bars */}
             <div className="absolute bottom-1 right-1 flex gap-0.5 items-end h-4">
                 <div className="w-1 bg-[#1DB954] h-2 animate-pulse"></div>
                 <div className="w-1 bg-[#1DB954] h-3 animate-pulse delay-75"></div>
                 <div className="w-1 bg-[#1DB954] h-1.5 animate-pulse delay-150"></div>
             </div>
          </div>
          
          <div className="flex-1 min-w-0">
             <h4 className="font-bold text-sm truncate text-gray-900 dark:text-white leading-tight">Deep Focus</h4>
             <p className="text-xs text-gray-500 dark:text-white/60 truncate">Ambient Chill</p>
             {/* Fake progress bar */}
             <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                 <div className="w-1/3 h-full bg-[#1DB954] rounded-full"></div>
             </div>
          </div>
       </div>

       {/* Controls */}
       <div className="flex justify-between items-center mt-3 z-10 px-2">
           <button className="text-gray-500 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors">
               <SkipBack className="w-5 h-5 fill-current" />
           </button>
           <button className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 transition-all shadow-lg hover:shadow-[#1DB954]/20">
               <Play className="w-5 h-5 fill-current ml-0.5" />
           </button>
           <button className="text-gray-500 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors">
               <SkipForward className="w-5 h-5 fill-current" />
           </button>
       </div>
    </div>
  );
};



export const NotionCard = () => {
  const [isConnected, setIsConnected] = useState(false);

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gradient-to-br dark:from-[#121212] dark:to-[#1E1E1E] rounded-3xl p-5 text-gray-900 dark:text-white h-full relative overflow-hidden group border border-gray-100 dark:border-white/5 flex flex-col shadow-lg transition-colors">
         {/* Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-black dark:bg-white rounded-full blur-[90px] opacity-[0.03] dark:opacity-10 pointer-events-none"></div>

         <div className="flex flex-col h-full z-10 relative">
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
                <div className="w-14 h-14 bg-gray-100 dark:bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 dark:shadow-white/10 group-hover:scale-110 transition-transform duration-300">
                    {/* Official Notion Logo SVG */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
                        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                    </svg>
                </div>
                
                <div className="text-center">
                    <h3 className="font-bold text-base mb-0.5 text-gray-900 dark:text-white">Notion</h3>
                    <p className="text-[10px] text-gray-500 dark:text-white/50 leading-tight">Sync databases</p>
                </div>
            </div>

            <button 
                onClick={() => setIsConnected(true)}
                className="w-full py-2.5 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-black/10 dark:shadow-white/10 mt-2 text-xs"
            >
                Connect
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-[#121212] dark:to-[#1E1E1E] rounded-3xl p-5 text-gray-900 dark:text-white h-full relative overflow-hidden group border border-gray-100 dark:border-white/5 flex flex-col justify-between shadow-lg transition-colors">
       {/* Connected State */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-black dark:bg-white rounded-full blur-[80px] opacity-[0.03] dark:opacity-5 pointer-events-none"></div>

       <div className="flex justify-between items-start z-10">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-black">
                     <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                </svg>
             </div>
             <div>
                <span className="font-bold text-xs tracking-wider opacity-80 uppercase block text-gray-700 dark:text-white">Productivity</span>
                <span className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Synced
                </span>
             </div>
          </div>
       </div>

       <div className="mt-4 space-y-3 z-10">
           <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-100 dark:border-white/5">
               <div className="flex justify-between items-center mb-1">
                   <span className="text-xs text-gray-500 dark:text-gray-400">Habits Database</span>
                   <span className="text-xs font-bold text-gray-900 dark:text-white">Connected</span>
               </div>
               <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                   <div className="w-full h-full bg-black dark:bg-white/50 rounded-full"></div>
               </div>
           </div>
       </div>

       <button className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-bold rounded-lg transition-colors mt-auto text-gray-900 dark:text-white">
           Full Sync
       </button>
    </div>
  );
};
