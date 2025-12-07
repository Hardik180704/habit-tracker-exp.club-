import { Music, Link as LinkIcon, Plus } from 'lucide-react';

export const SpotifyCard = () => {
  return (
    <div className="bg-gray-50 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col justify-between">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center shadow-lg shadow-green-100">
          <Music className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <div className="text-center mb-6">
        <h3 className="font-bold text-gray-900 mb-1">Connect your<br/>Spotify account</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Empower yourself with habit tracking while enjoying uninterrupted music
        </p>
      </div>

      <button className="w-full py-3 bg-[#191414] text-white text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors">
        <LinkIcon className="w-4 h-4" />
        Link Account
      </button>
    </div>
  );
};

export const MoreIntegrationsCard = () => {
  return (
    <div className="bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-3xl p-6 flex flex-col items-center justify-center text-white text-center h-full relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
      <div className="absolute top-0 right-0 p-8 w-24 h-24 border-[3px] border-white/20 rounded-full -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 p-6 w-20 h-20 bg-white/10 rounded-full -ml-8 -mb-8" />
      
      <div className="relative z-10">
        <h3 className="font-bold text-lg mb-1">More Integrations</h3>
        <p className="text-white/80 text-xs font-medium mb-3">23+ apps</p>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto">
          <Plus className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
