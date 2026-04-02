import { useQuery } from '@tanstack/react-query';
import { getWeatherProvider } from '../lib/providers';
import type { WeatherProviderId } from '../lib/types';

export function useWeatherQuery(providerId: WeatherProviderId, location: string) {
  return useQuery({
    queryKey: ['weather', providerId, location],
    enabled: location.length > 0,
    queryFn: async ({ signal }) => {
      const currentProvider = getWeatherProvider(providerId);
      return currentProvider.fetchWeather(location, signal);
    },
  });
}
