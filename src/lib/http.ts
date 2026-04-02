import { WeatherError } from './errors';

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new WeatherError('requestFailed');
  }

  return response.json() as Promise<T>;
}
