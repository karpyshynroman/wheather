import { create } from 'zustand';
import type { WeatherProviderId } from '../lib/types';

interface WeatherStore {
  providerId: WeatherProviderId;
  draftLocation: string;
  activeLocation: string;
  setProviderId: (providerId: WeatherProviderId) => void;
  setDraftLocation: (value: string) => void;
  setActiveLocation: (value: string) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  providerId: 'open-meteo',
  draftLocation: '',
  activeLocation: '',
  setProviderId: (providerId) => set({ providerId }),
  setDraftLocation: (draftLocation) => set({ draftLocation }),
  setActiveLocation: (activeLocation) => set({ activeLocation }),
}));
