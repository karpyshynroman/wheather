import { create } from 'zustand';
import { getInitialLanguage, persistLanguage, type Language } from '../lib/i18n';
import type { WeatherProviderId } from '../lib/types';

interface WeatherStore {
  providerId: WeatherProviderId;
  draftLocation: string;
  activeLocation: string;
  language: Language;
  setProviderId: (providerId: WeatherProviderId) => void;
  setDraftLocation: (value: string) => void;
  setActiveLocation: (value: string) => void;
  setLanguage: (language: Language) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  providerId: 'open-meteo',
  draftLocation: '',
  activeLocation: '',
  language: getInitialLanguage(),
  setProviderId: (providerId) => set({ providerId }),
  setDraftLocation: (draftLocation) => set({ draftLocation }),
  setActiveLocation: (activeLocation) => set({ activeLocation }),
  setLanguage: (language) => {
    persistLanguage(language);
    set({ language });
  },
}));
