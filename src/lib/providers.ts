import { fetchJson } from './http';
import { describeOpenMeteoCode, describeTextCondition } from './weather-code';
import type { WeatherProviderDefinition, WeatherProviderId, WeatherSnapshot } from './types';

interface OpenMeteoGeocodeResponse {
  results?: Array<{
    name: string;
    admin1?: string;
    country?: string;
    latitude: number;
    longitude: number;
  }>;
}

interface OpenMeteoWeatherResponse {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    pressure_msl: number;
    visibility: number;
  };
}

interface WttrResponse {
  current_condition?: Array<{
    temp_C: string;
    FeelsLikeC: string;
    humidity: string;
    pressure: string;
    visibility: string;
    windspeedKmph: string;
    observation_time: string;
    weatherDesc: Array<{ value: string }>;
  }>;
  nearest_area?: Array<{
    areaName?: Array<{ value: string }>;
    region?: Array<{ value: string }>;
    country?: Array<{ value: string }>;
  }>;
}

function formatLocationName(parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(', ');
}

async function fetchOpenMeteo(location: string, signal?: AbortSignal): Promise<WeatherSnapshot> {
  const geo = await fetchJson<OpenMeteoGeocodeResponse>(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`,
    { signal },
  );

  const result = geo.results?.[0];
  if (!result) {
    throw new Error('No matching location was found.');
  }

  const weather = await fetchJson<OpenMeteoWeatherResponse>(
    `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,visibility&temperature_unit=celsius&windspeed_unit=kmh&timezone=auto`,
    { signal },
  );

  if (!weather.current) {
    throw new Error('Weather data is unavailable for this location.');
  }

  const descriptor = describeOpenMeteoCode(weather.current.weather_code);

  return {
    locationName: formatLocationName([result.name, result.admin1, result.country]),
    sourceLabel: 'Open-Meteo',
    condition: descriptor.condition,
    icon: descriptor.icon,
    temperatureC: weather.current.temperature_2m,
    feelsLikeC: weather.current.apparent_temperature,
    humidityPct: weather.current.relative_humidity_2m,
    windKph: weather.current.wind_speed_10m,
    pressureHpa: weather.current.pressure_msl,
    visibilityKm: weather.current.visibility,
    observedAt: weather.current.time,
  };
}

function toNumber(value: string | number | undefined): number {
  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number.parseFloat(String(value ?? '0'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function isoNowFromObservation(observation: string): string {
  const today = new Date();
  const [timePart, meridiem] = observation.trim().split(/\s+/);
  if (!timePart || !meridiem) {
    return today.toISOString();
  }

  const [hoursRaw, minutesRaw] = timePart.split(':');
  let hours = Number.parseInt(hoursRaw ?? '0', 10);
  const minutes = Number.parseInt(minutesRaw ?? '0', 10);
  const normalizedMeridiem = meridiem.toLowerCase();

  if (normalizedMeridiem === 'pm' && hours < 12) {
    hours += 12;
  }

  if (normalizedMeridiem === 'am' && hours === 12) {
    hours = 0;
  }

  const local = new Date(today);
  local.setHours(hours, minutes, 0, 0);
  return local.toISOString();
}

async function fetchWttr(location: string, signal?: AbortSignal): Promise<WeatherSnapshot> {
  const data = await fetchJson<WttrResponse>(`https://wttr.in/${encodeURIComponent(location)}?format=j1`, {
    signal,
  });

  const current = data.current_condition?.[0];
  if (!current) {
    throw new Error('Weather data is unavailable for this location.');
  }

  const descriptor = describeTextCondition(current.weatherDesc?.[0]?.value ?? 'Clear');
  const area = data.nearest_area?.[0];
  const locationName = formatLocationName([
    area?.areaName?.[0]?.value,
    area?.region?.[0]?.value,
    area?.country?.[0]?.value,
  ]);

  return {
    locationName: locationName || location,
    sourceLabel: 'WTTR',
    condition: descriptor.condition,
    icon: descriptor.icon,
    temperatureC: toNumber(current.temp_C),
    feelsLikeC: toNumber(current.FeelsLikeC),
    humidityPct: toNumber(current.humidity),
    windKph: toNumber(current.windspeedKmph),
    pressureHpa: toNumber(current.pressure),
    visibilityKm: toNumber(current.visibility),
    observedAt: isoNowFromObservation(current.observation_time),
  };
}

export const providerDefinitions: Record<WeatherProviderId, WeatherProviderDefinition> = {
  'open-meteo': {
    id: 'open-meteo',
    name: 'Open-Meteo',
    shortName: 'Open-Meteo',
    tagline: 'Fast global coverage',
    accent: '#61dafb',
    accentSoft: 'rgba(97, 218, 251, 0.16)',
    emphasis: 'from-cyan-400 via-sky-500 to-indigo-500',
  },
  wttr: {
    id: 'wttr',
    name: 'WTTR',
    shortName: 'WTTR',
    tagline: 'Direct text-first weather feed',
    accent: '#ff9f6f',
    accentSoft: 'rgba(255, 159, 111, 0.16)',
    emphasis: 'from-orange-400 via-rose-500 to-fuchsia-500',
  },
};

export const weatherProviders = {
  'open-meteo': {
    definition: providerDefinitions['open-meteo'],
    fetchWeather: fetchOpenMeteo,
  },
  wttr: {
    definition: providerDefinitions.wttr,
    fetchWeather: fetchWttr,
  },
};

export function getWeatherProvider(id: WeatherProviderId) {
  return weatherProviders[id];
}
