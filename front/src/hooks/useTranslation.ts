import { useMemo } from 'react';
import { translate } from '../lib/i18n';
import { useWeatherStore } from '../store/weather-store';

export function useTranslation() {
  const language = useWeatherStore((state) => state.language);

  return useMemo(
    () => ({
      language,
      t: (key: string, params?: Record<string, string | number>) => translate(language, key, params),
    }),
    [language],
  );
}

