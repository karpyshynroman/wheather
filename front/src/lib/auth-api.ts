import { requestJson } from './api';
import type { AuthCredentials, AuthSession, AuthUser, WeatherSearchHistoryItem } from './auth-types';

export function register(credentials: AuthCredentials) {
  return requestJson<AuthSession>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function login(credentials: AuthCredentials) {
  return requestJson<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function fetchCurrentUser(token: string) {
  return requestJson<AuthUser>('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function fetchSearchHistory(token: string) {
  return requestJson<WeatherSearchHistoryItem[]>('/history/searches', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function saveSearchHistory(
  token: string,
  payload: Omit<WeatherSearchHistoryItem, 'id' | 'createdAt'>,
) {
  return requestJson<WeatherSearchHistoryItem>('/history/searches', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
