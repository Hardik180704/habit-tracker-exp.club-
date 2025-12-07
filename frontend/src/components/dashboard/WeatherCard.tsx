import { useState, useEffect, useCallback } from 'react';
import { CloudRain, Umbrella, Sun, Cloud, CloudSnow, Loader2, MapPin } from 'lucide-react';
import axios from 'axios';

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  conditionCode: number;
}

interface WeatherData {
  temperature: number;
  windSpeed: number;
  condition: string;
  isDay: boolean;
  minTemp: number;
  maxTemp: number;
  forecast: ForecastDay[];
  location: string;
}

const WeatherCard = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const fetchDefaultWeather = useCallback(async () => {
    try {
        // Default to New York
        const weatherRes = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.00&current=temperature_2m,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
        );
        const current = weatherRes.data.current;
        const daily = weatherRes.data.daily;

         // Simulate forecast for default
         const forecast: ForecastDay[] = [];
         for (let i = 1; i <= 3; i++) {
             forecast.push({
                 date: daily.time[i],
                 maxTemp: Math.round(daily.temperature_2m_max[i]),
                 minTemp: Math.round(daily.temperature_2m_min[i]),
                 conditionCode: daily.weather_code[i]
             });
         }

        setWeather({
            temperature: Math.round(current.temperature_2m),
            windSpeed: Math.round(current.wind_speed_10m),
            condition: getWeatherCondition(current.weather_code),
            isDay: current.is_day === 1,
            minTemp: Math.round(daily.temperature_2m_min[0]),
            maxTemp: Math.round(daily.temperature_2m_max[0]),
            forecast,
            location: 'New York'
        });
    } catch {
        setError('Failed to load weather');
    } finally {
        setLoading(false);
    }
  }, []);

  const fetchWeather = useCallback(async (lat: number, lon: number) => {
    try {
        // Parallel requests for weather and location
        const [weatherRes, locationRes] = await Promise.all([
            axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
            ),
            axios.get(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            )
        ]);

        const current = weatherRes.data.current;
        const daily = weatherRes.data.daily;
        const locationName = locationRes.data.city || locationRes.data.locality || 'Unknown Location';

        // Map next 3 days (index 1, 2, 3)
        const forecast: ForecastDay[] = [];
        for (let i = 1; i <= 3; i++) {
            forecast.push({
                date: daily.time[i],
                maxTemp: Math.round(daily.temperature_2m_max[i]),
                minTemp: Math.round(daily.temperature_2m_min[i]),
                conditionCode: daily.weather_code[i]
            });
        }

        setWeather({
            temperature: Math.round(current.temperature_2m),
            windSpeed: Math.round(current.wind_speed_10m),
            condition: getWeatherCondition(current.weather_code),
            isDay: current.is_day === 1,
            minTemp: Math.round(daily.temperature_2m_min[0]),
            maxTemp: Math.round(daily.temperature_2m_max[0]),
            forecast,
            location: locationName
        });
        setLoading(false);

    } catch (err) {
        console.error("API Error", err);
        throw err; // Trigger fallback in caller
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            await fetchWeather(latitude, longitude);
          } catch (err) {
            console.error('Weather fetch error:', err);
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
  }, [fetchDefaultWeather, fetchWeather]);

  // ... (getWeatherCondition and getWeatherIcon helpers remain unchanged)
  // ... (getDayName helper remains unchanged)

  const getWeatherIcon = (condition: string, isDay: boolean, size = "w-8 h-8") => {
    switch (condition) {
      case 'Clear': return isDay ? <Sun className={`${size} text-yellow-500`} /> : <Sun className={`${size} text-blue-200`} />;
      case 'Partly Cloudy': 
      case 'Cloudy': return <Cloud className={`${size} text-gray-400`} />;
      case 'Rainy': 
      case 'Showers': return <CloudRain className={`${size} text-blue-400`} />;
      case 'Snowy': return <CloudSnow className={`${size} text-cyan-200`} />;
      case 'Thunderstorm': return <CloudRain className={`${size} text-purple-500`} />;
      case 'Foggy': return <Cloud className={`${size} text-gray-300`} />;
      default: return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  const getDayName = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
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

      <div className="relative z-10 flex flex-col h-full">
        {/* Top Section: Current Weather */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                {getWeatherIcon(weather?.condition || 'Clear', weather?.isDay || true)}
                <span className="font-medium text-lg text-gray-800 dark:text-gray-100">{weather?.condition}</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">{weather?.temperature}°</h2>
          </div>
          <div className="bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/20 text-gray-700 dark:text-gray-200 dark:bg-black/20 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {weather?.location}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-900/10 dark:bg-white/10 my-2" />

        {/* Bottom Section: Forecast */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
            {weather?.forecast.map((day) => (
                <div key={day.date} className="flex flex-col items-center text-center">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">{getDayName(day.date)}</span>
                    <div className="my-1">
                        {getWeatherIcon(getWeatherCondition(day.conditionCode), true, "w-5 h-5")}
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {day.maxTemp}° <span className="text-gray-400 dark:text-gray-500 text-[10px]">{day.minTemp}°</span>
                    </span>
                </div>
            ))}
        </div>
        
        {/* Decorative Umbrella - Repositioned */}
        <div className="absolute bottom-[-20px] left-[-20px] text-orange-500 opacity-10 rotate-12 pointer-events-none">
            <Umbrella size={100} />
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
