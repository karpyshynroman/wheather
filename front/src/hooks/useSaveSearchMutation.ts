import { useMutation } from '@tanstack/react-query';
import { saveSearchHistory } from '../lib/auth-api';
import { ApiError } from '../lib/api';
import type { WeatherSearchHistoryItem } from '../lib/auth-types';
import { useTranslation } from './useTranslation';

interface UseSaveSearchMutationOptions {
  token: string | null;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function useSaveSearchMutation({ token, onSuccess, onError }: UseSaveSearchMutationOptions) {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (payload: Omit<WeatherSearchHistoryItem, 'id' | 'createdAt'>) => {
      if (!token) {
        throw new Error('Missing access token.');
      }

      return saveSearchHistory(token, payload);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        onError(error.message);
        return;
      }

      onError(t('weather.unavailable'));
    },
  });
}
