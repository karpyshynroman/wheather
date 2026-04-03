import { useQuery } from '@tanstack/react-query';
import { fetchSearchHistory } from '../lib/auth-api';

interface UseHistoryQueryOptions {
  token: string | null;
  userId: string | null;
  enabled: boolean;
}

export function useHistoryQuery({ token, userId, enabled }: UseHistoryQueryOptions) {
  return useQuery({
    queryKey: ['history', userId],
    enabled: enabled && Boolean(token && userId),
    queryFn: async () => {
      if (!token) {
        return [];
      }

      return fetchSearchHistory(token);
    },
  });
}
