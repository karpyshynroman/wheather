import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { useWeatherStore } from '../store/weather-store';

afterEach(() => {
  vi.restoreAllMocks();
  useWeatherStore.setState({
    providerId: 'open-meteo',
    draftLocation: '',
    activeLocation: '',
    language: 'en',
  });
  window.localStorage.removeItem('weather-language');
  document.documentElement.lang = 'en';
});
