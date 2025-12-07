import { Download } from 'lucide-react';

const AppDownloadBanner = () => {
  return (
    <div className="bg-[#FFF8E1] rounded-3xl p-6 relative overflow-hidden text-center mt-auto">
      {/* Decorative stars/sparkles */}
      <div className="absolute top-4 left-4 text-orange-400">
         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
         </svg>
      </div>
      <div className="absolute top-10 right-6 text-orange-300">
         <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
         </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Emoji/Icon representation */}
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-orange-50">
           <span className="text-3xl">📱</span>
        </div>

        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
            Sync anywhere with<br/>
            Habit Tracker App
        </h3>
        
        <p className="text-xs text-gray-500 mb-4 px-2">
            Download now, sync later!
        </p>

        <button className="w-full py-3 bg-white border border-orange-100 text-gray-900 font-bold rounded-xl text-xs hover:bg-orange-50 transition-colors shadow-sm flex items-center justify-center gap-2">
           <Download className="w-4 h-4" />
           Download App
        </button>
      </div>
    </div>
  );
};

export default AppDownloadBanner;
