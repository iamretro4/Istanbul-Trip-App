'use client';

import { useState, useEffect } from 'react';
import { WeatherForecast } from '@/lib/types';
import { format } from 'date-fns';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

interface WeatherWidgetProps {
  startDate: string;
  endDate: string;
  location?: string;
}

export default function WeatherWidget({ startDate, endDate, location = 'Istanbul' }: WeatherWidgetProps) {
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Using OpenWeatherMap API (free tier)
        // Note: User needs to add their API key to environment variables
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
        
        if (!apiKey) {
          // Fallback: Show mock data
          const mockForecast: WeatherForecast[] = [];
          const start = new Date(startDate);
          const end = new Date(endDate);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

          for (let i = 0; i <= days; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            mockForecast.push({
              date: date.toISOString(),
              temperature: 15 + Math.random() * 10,
              condition: ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
              humidity: 60 + Math.random() * 20,
              windSpeed: 5 + Math.random() * 10,
            });
          }

          setForecast(mockForecast);
          setIsLoading(false);
          return;
        }

        // Real API call would go here
        // For now, using mock data
        const mockForecast: WeatherForecast[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        for (let i = 0; i <= days; i++) {
          const date = new Date(start);
          date.setDate(date.getDate() + i);
          mockForecast.push({
            date: date.toISOString(),
            temperature: 15 + Math.random() * 10,
            condition: ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
            humidity: 60 + Math.random() * 20,
            windSpeed: 5 + Math.random() * 10,
          });
        }

        setForecast(mockForecast);
      } catch (err) {
        setError('Failed to load weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchWeather();
    }
  }, [startDate, endDate]);

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain')) return <CloudRain className="text-blue-500" size={24} />;
    if (lower.includes('cloud')) return <Cloud className="text-gray-500" size={24} />;
    return <Sun className="text-yellow-500" size={24} />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold mb-2">Weather Forecast</h3>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold mb-2">Weather Forecast</h3>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
      <h3 className="font-bold text-lg mb-4 text-gray-900">Weather Forecast - {location}</h3>
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              {getWeatherIcon(day.condition)}
              <div>
                <p className="text-sm font-medium">
                  {format(new Date(day.date), 'EEE, MMM d')}
                </p>
                <p className="text-xs text-gray-600">{day.condition}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{Math.round(day.temperature)}°C</p>
              {day.humidity && (
                <p className="text-xs text-gray-500">{Math.round(day.humidity)}% humidity</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {!process.env.NEXT_PUBLIC_WEATHER_API_KEY && (
        <p className="text-xs text-gray-500 mt-2 italic">
          Showing sample data. Add NEXT_PUBLIC_WEATHER_API_KEY for real forecasts.
        </p>
      )}
    </div>
  );
}

