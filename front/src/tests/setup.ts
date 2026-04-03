import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { useAuthStore } from '../store/auth-store';
import { useWeatherStore } from '../store/weather-store';

afterEach(() => {
  vi.restoreAllMocks();
  useWeatherStore.setState({
    providerId: 'open-meteo',
    draftLocation: '',
    activeLocation: '',
    language: 'en',
  });
  useAuthStore.setState({
    token: null,
    user: null,
    hydrated: false,
  });
  window.localStorage.removeItem('weather-auth-session');
  window.localStorage.removeItem('weather-language');
  document.documentElement.lang = 'en';
});
