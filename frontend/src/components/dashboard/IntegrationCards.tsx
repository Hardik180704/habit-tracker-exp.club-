import { useState, useEffect, useCallback } from 'react';
import { Play, SkipForward, SkipBack, Heart } from 'lucide-react';
import api from '../../services/api';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface SpotifyTrack {
  name: string;
  artist: string;
  albumArt?: string;
  progress: number;
  duration: number;
  isPlaying: boolean;
}

export const SpotifyCard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [track, setTrack] = useState<SpotifyTrack | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      const res = await api.get('/integrations/spotify/status');
      if (res.data.isConnected) {
        setIsConnected(true);
        if (res.data.isPlaying) {
          setTrack({ ...res.data.track, isPlaying: true });
        } else {
          setTrack(null);
        }
      }
    } catch (error) {
      console.error('Spotify status error', error);
    }
  }, []);

  // Check status on mount
  useEffect(() => {
    // eslint-disable-next-line
    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [checkStatus]);

  const handleConnect = async () => {
    try {
      const res = await api.get('/integrations/spotify/auth');
      window.location.href = res.data.url;
    } catch {
      toast.error('Failed to start Spotify connection');
    }
  };

  const handleControl = async (action: 'play' | 'pause' | 'next' | 'previous') => {
    try {
      // Optimistic update
      if (action === 'play') setTrack((prev) => (prev ? { ...prev, isPlaying: true } : null));
      if (action === 'pause') setTrack((prev) => (prev ? { ...prev, isPlaying: false } : null));

      await api.post(`/integrations/spotify/${action}`);
      setTimeout(checkStatus, 500); // Pulse check to sync real state
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || `Failed to ${action} music`);
    }
  };


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
                onClick={handleConnect}
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
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleConnect} title="Reconnect Spotify">
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
          {track ? (
            <>
              <div className="w-14 h-14 rounded-lg bg-black/20 shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {track.albumArt ? (
                    <img src={track.albumArt} alt="Album Art" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white/50" />
                    </div>
                  )}
              </div>
              
              <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate text-gray-900 dark:text-white leading-tight">{track.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-white/60 truncate">{track.artist}</p>
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-[#1DB954] rounded-full transition-all duration-1000"
                        style={{ width: `${(track.progress / track.duration) * 100}%` }}
                      ></div>
                  </div>
              </div>
            </>
          ) : (
            <div className="flex-1 text-center py-2">
               <p className="text-sm font-medium text-gray-500 dark:text-white/50">No music playing</p>
               <p className="text-xs text-gray-400 dark:text-white/30">Open Spotify to sync</p>
            </div>
          )}
       </div>

       {/* Controls */}
       <div className="flex justify-between items-center mt-3 z-10 px-2">
           <button 
                onClick={() => handleControl('previous')}
                className="text-gray-500 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors"
            >
               <SkipBack className="w-5 h-5 fill-current" />
           </button>
           <button 
                onClick={() => handleControl(track?.isPlaying ? 'pause' : 'play')}
                className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 transition-all shadow-lg hover:shadow-[#1DB954]/20"
            >
                {/* Dynamically toggle icon */}
               {track?.isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                       <rect x="6" y="4" width="4" height="16" rx="1" />
                       <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
               ) : (
                   <Play className="w-5 h-5 fill-current ml-0.5" />
               )}
           </button>
           <button 
                onClick={() => handleControl('next')}
                className="text-gray-500 hover:text-gray-900 dark:text-white/70 dark:hover:text-white transition-colors"
            >
               <SkipForward className="w-5 h-5 fill-current" />
           </button>
       </div>
    </div>
  );
};



interface NotionPage {
  id: string;
  url: string;
  icon: string;
  title: string;
  lastEdited: string;
}

export const NotionCard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceIcon, setWorkspaceIcon] = useState('');
  const [recentPages, setRecentPages] = useState<NotionPage[]>([]);

  const fetchPages = useCallback(async () => {
    try {
      const res = await api.get('/integrations/notion/pages');
      setRecentPages(res.data.pages || []);
    } catch {
      console.error('Failed to fetch pages');
    }
  }, []);

  const checkStatus = useCallback(async () => {
    try {
      const res = await api.get('/integrations/notion/status');
      if (res.data.isConnected) {
        setIsConnected(true);
        setWorkspaceName(res.data.workspaceName);
        setWorkspaceIcon(res.data.workspaceIcon);
        fetchPages();
      }
    } catch (error) {
      console.error('Notion status error', error);
    }
  }, [fetchPages]);

  useEffect(() => {
    // eslint-disable-next-line
    checkStatus();
  }, [checkStatus]);

  const handleConnect = async () => {
    try {
      const res = await api.get('/integrations/notion/auth');
      window.location.href = res.data.url;
    } catch {
      toast.error('Failed to start Notion connection');
    }
  };

  const handleConfigure = () => {
    toast.success(`Sync active with ${workspaceName}`, {
      icon: '✅',
      duration: 3000
    });
    toast('Advanced settings coming soon!', {
        icon: '⚙️',
        duration: 2000,
        style: { fontSize: '12px' }
    });
  };

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
                onClick={handleConnect}
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

       <div className="flex justify-between items-start z-10 mb-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white flex items-center justify-center overflow-hidden">
                {workspaceIcon ? (
                   workspaceIcon.startsWith('http') ? (
                     <img src={workspaceIcon} alt="Icon" className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-lg">{workspaceIcon}</span>
                   )
                ) : (
                   <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black">
                        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                   </svg>
                )}
             </div>
             <div>
                <span className="font-bold text-xs tracking-wider opacity-80 uppercase block text-gray-700 dark:text-white">Workspace</span>
                <span className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    ACTIVE
                </span>
             </div>
          </div>
       </div>

       {/* Recent Pages List */}
       <div className="flex-1 space-y-2 z-10 overflow-y-auto mb-2 pr-1 custom-scrollbar">
          {recentPages.length > 0 ? (
            recentPages.map(page => (
              <a 
                key={page.id} 
                href={page.url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10"
              >
                 <span className="text-xl">{page.icon}</span>
                 <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">{page.title}</h4>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400">Edited {new Date(page.lastEdited).toLocaleDateString()}</p>
                 </div>
                 <svg className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
              </a>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-4">
               <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-2">
                 <span className="text-sm">🔍</span>
               </div>
               <span className="text-[10px] text-gray-400">Searching your Notion...</span>
            </div>
          )}
       </div>

       <button 
         onClick={handleConfigure}
         className="w-full py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-bold rounded-lg transition-colors mt-auto text-gray-900 dark:text-white"
        >
           Configure Sync
       </button>
    </div>
  );
};
