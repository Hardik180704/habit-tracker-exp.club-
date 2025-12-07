import { CloudRain, Wind, Droplets, Umbrella } from 'lucide-react';

const WeatherCard = () => {
  return (
    <div className="bg-[#FEF3C7] rounded-3xl p-6 relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:scale-110" />

      <div className="flex justify-between items-start relative z-10 mb-8">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Weather</h3>
          <div className="flex items-center gap-2 mt-4">
            <div className="p-3 bg-white/50 backdrop-blur-sm rounded-2xl">
              <CloudRain className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <span className="text-4xl font-bold text-gray-900">12°C</span>
            </div>
          </div>
        </div>
        <button className="text-xs font-semibold text-gray-500 hover:text-gray-900">View Details</button>
      </div>

      <div className="grid grid-cols-3 gap-4 relative z-10">
        <div>
          <p className="text-xs text-gray-500 mb-1">Wind</p>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3 text-gray-400" />
            <span className="text-sm font-bold text-gray-800">2-4 km/h</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Pressure</p>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-gray-800">102m</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Humidity</p>
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-400" />
            <span className="text-sm font-bold text-gray-800">42%</span>
          </div>
        </div>
      </div>
      
      {/* Visual Umbrella (could be an image, using icon for now) */}
      <div className="absolute bottom-[-20px] right-[-20px] text-orange-600 opacity-20 rotate-12">
        <Umbrella size={140} />
      </div>
    </div>
  );
};

export default WeatherCard;
