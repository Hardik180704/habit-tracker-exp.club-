import { useState, useEffect } from 'react';
import { CloudRain, Umbrella, Sun, Cloud, CloudSnow, Loader2, MapPin } from 'lucide-react';
import axios from 'axios';

interface WeatherData {
  temperature: number;
  windSpeed: number;
  condition: string;
  isDay: boolean;
  minTemp: number;
  maxTemp: number;
}

const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Open-Meteo API (Free, No Key)
            const response = await axios.get(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
            );

            const current = response.data.current;
            const daily = response.data.daily;

            setWeather({
              temperature: Math.round(current.temperature_2m),
              windSpeed: Math.round(current.wind_speed_10m),
              condition: getWeatherCondition(current.weather_code),
              isDay: current.is_day === 1,
              minTemp: Math.round(daily.temperature_2m_min[0]),
              maxTemp: Math.round(daily.temperature_2m_max[0])
            });
            setLoading(false);
          } catch (err) {
            console.error('Weather fetch error:', err);
            // Fallback to default
            fetchDefaultWeather();
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          fetchDefaultWeather();
        },
        { timeout: 5000 }
      );
    } else {
      fetchDefaultWeather();
    }
  }, []);

  const fetchDefaultWeather = async () => {
    try {
        // Default to New York
        const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.00&current=temperature_2m,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const current = response.data.current;
        const daily = response.data.daily;

        setWeather({
            temperature: Math.round(current.temperature_2m),
            windSpeed: Math.round(current.wind_speed_10m),
            condition: getWeatherCondition(current.weather_code),
            isDay: current.is_day === 1,
            minTemp: Math.round(daily.temperature_2m_min[0]),
            maxTemp: Math.round(daily.temperature_2m_max[0])
        });
    } catch (e) {
        setError('Failed to load weather');
    } finally {
        setLoading(false);
    }
  };

  const getWeatherCondition = (code: number): string => {
    if (code === 0) return 'Clear';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Cloudy';
  };

  const getWeatherIcon = (condition: string, isDay: boolean) => {
    switch (condition) {
      case 'Clear': return isDay ? <Sun className="w-8 h-8 text-yellow-500" /> : <Sun className="w-8 h-8 text-blue-200" />; // Moon icon substitute
      case 'Partly Cloudy': 
      case 'Cloudy': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'Rainy': 
      case 'Showers': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'Snowy': return <CloudSnow className="w-8 h-8 text-cyan-200" />;
      case 'Thunderstorm': return <CloudRain className="w-8 h-8 text-purple-500" />; // Zap icon substitute
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
        <div className="bg-[#B4C6F0] rounded-3xl p-6 text-white h-[200px] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-[#B4C6F0] rounded-3xl p-6 text-white h-[200px] flex flex-col items-center justify-center text-center">
            <MapPin className="w-8 h-8 mb-2 text-white/50" />
            <p className="text-sm font-medium opacity-80">{error}</p>
            <p className="text-xs opacity-60 mt-1">Check permissions</p>
        </div>
    );
  }

  return (
    <div className="bg-[#FEF3C7] rounded-3xl p-6 h-full relative overflow-hidden flex flex-col justify-between dark:bg-yellow-900/40 dark:border dark:border-yellow-700/30 transition-colors">
      {/* Decorative background blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-colors"></div>
      <div className="absolute top-20 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
                {getWeatherIcon(weather?.condition || 'Clear', weather?.isDay || true)}
                <span className="font-medium text-lg text-gray-800">{weather?.condition}</span>
            </div>
          </div>
          <div className="bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20 text-gray-700">
            Local
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-5xl font-bold tracking-tighter mb-1 text-gray-900">{weather?.temperature}°</h2>
            <div className="flex gap-3 text-gray-600 text-xs font-bold mt-2">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase opacity-60">Wind</span>
                    <span>{weather?.windSpeed} km/h</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase opacity-60">Pressure</span>
                    <span>1024mb</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase opacity-60">Humidity</span>
                    <span>42%</span>
                </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Umbrella */}
        <div className="absolute bottom-[-10px] right-[-10px] text-orange-500 opacity-20 rotate-12 pointer-events-none">
            <Umbrella size={120} />
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
