import React, { useEffect, useState, useCallback } from 'react';
import {
  CloudSun,
  CloudRain,
  Cloud,
  Sun,
  CloudLightning,
  RefreshCw,
  MapPin,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export interface WeatherData {
  area: string;
  forecast: string | null;
  validPeriod: string;
  updatedAt: string;
}

export const CityWeatherWidget: React.FC = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // The browser calls only the internal serverless route at /api/weather
      const res = await fetch('/api/weather');
      if (!res.ok) {
        if (res.status === 429) {
          setErrorMessage('The weather service is busy right now. Please try again in a few minutes.');
        } else {
          setErrorMessage('Live weather is temporarily unavailable. Please try again shortly.');
        }
        return;
      }
      const json: WeatherData = await res.json();
      setData(json);
    } catch (_err) {
      setErrorMessage('Live weather is temporarily unavailable. Please try again shortly.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Helper to map Singapore forecast string to an appropriate weather icon
  const getWeatherIcon = (forecast: string | null) => {
    if (!forecast) return <CloudSun className="w-5 h-5 text-indigo-500" />;
    const lower = forecast.toLowerCase();
    if (lower.includes('thunder') || lower.includes('lightning')) {
      return <CloudLightning className="w-5 h-5 text-amber-500" />;
    }
    if (lower.includes('rain') || lower.includes('shower')) {
      return <CloudRain className="w-5 h-5 text-sky-500" />;
    }
    if (lower.includes('cloud')) {
      return <Cloud className="w-5 h-5 text-slate-500" />;
    }
    if (lower.includes('fair') || lower.includes('clear') || lower.includes('sun')) {
      return <Sun className="w-5 h-5 text-amber-500" />;
    }
    return <CloudSun className="w-5 h-5 text-indigo-500" />;
  };

  return (
    <section
      id="city-weather-widget"
      aria-label="SMU Campus Weather"
      className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Header & Area Label */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
            {getWeatherIcon(data?.forecast ?? null)}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                SMU Campus (City Area)
              </span>
              <span className="text-xs text-slate-400 font-normal">•</span>
              <span className="text-xs font-medium text-slate-500">2-Hour Forecast</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              In-Person Tutoring Weather Outlook
            </h3>
          </div>
        </div>

        {/* Refresh Action */}
        <div className="self-end sm:self-auto flex items-center gap-2">
          <button
            id="refresh-weather-btn"
            type="button"
            onClick={fetchWeather}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/60 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50 min-h-[36px]"
            title="Refresh City forecast"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{loading ? 'Updating…' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content States */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        {/* 1. Loading State */}
        {loading && (
          <div
            id="weather-loading-state"
            className="flex items-center gap-2.5 text-slate-600 py-1 text-sm font-medium"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
            <span>Checking the latest City forecast for your in-person session…</span>
          </div>
        )}

        {/* 2. Error State (Provider refusal, rate limit, or network failure) */}
        {!loading && errorMessage && (
          <div
            id="weather-error-state"
            className="flex items-start gap-2.5 text-amber-800 bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs sm:text-sm font-medium"
          >
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={fetchWeather}
              className="text-xs font-bold text-amber-900 underline hover:no-underline ml-2 cursor-pointer shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* 3. Empty-State Message (if City is not in the response) */}
        {!loading && !errorMessage && data && data.forecast === null && (
          <div
            id="weather-empty-state"
            className="flex items-center gap-2 text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium"
          >
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <p>
              A City forecast is not available right now. Please check again shortly.
            </p>
          </div>
        )}

        {/* 4. Successful Display of the Forecast and Time Period */}
        {!loading && !errorMessage && data && data.forecast !== null && (
          <div
            id="weather-success-state"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/80 border border-slate-200/70 rounded-xl px-3.5 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wide bg-indigo-600 text-white shadow-2xs">
                {data.forecast}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                Official NEA 2-Hour Outlook
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Valid: <strong>{data.validPeriod || 'Current 2-hr window'}</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Attribution Credit */}
      <div className="mt-3 pt-2 text-[11px] text-slate-400 leading-relaxed">
        Contains information from the National Environment Agency, Singapore, which is made available under the terms of the Singapore Open Data Licence version 1.0.
      </div>
    </section>
  );
};
