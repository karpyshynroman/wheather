import { useMutation } from '@tanstack/react-query';
import { login, register } from '../lib/auth-api';
import { ApiError } from '../lib/api';
import type { AuthSession } from '../lib/auth-types';
import { queryClient } from '../lib/query-client';
import { useTranslation } from './useTranslation';

export type AuthMode = 'login' | 'register';

export interface AuthSubmission {
  email: string;
  password: string;
  mode: AuthMode;
}

interface UseAuthMutationOptions {
  onSuccess: (session: AuthSession) => void;
  onError: (message: string) => void;
}

export function useAuthMutation({ onSuccess, onError }: UseAuthMutationOptions) {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (payload: AuthSubmission) => {
      const credentials = {
        email: payload.email,
        password: payload.password,
      };

      return payload.mode === 'login' ? login(credentials) : register(credentials);
    },
    onSuccess: (session) => {
      onSuccess(session);
      void queryClient.invalidateQueries({ queryKey: ['history', session.user.id] });
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
