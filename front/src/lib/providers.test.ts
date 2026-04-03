import { describe, expect, it, vi } from 'vitest';
import { getWeatherProvider } from './providers';

describe('weather providers', () => {
  it('maps Open-Meteo response into a snapshot', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              name: 'Berlin',
              admin1: 'Berlin',
              country: 'Germany',
              latitude: 52.52,
              longitude: 13.41,
            },
            {
              name: 'Berlin',
              admin1: 'North Dakota',
              country: 'United States',
              latitude: 45.42,
              longitude: -99.63,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            time: '2026-04-02T10:00',
            temperature_2m: 12.4,
            apparent_temperature: 10.7,
            relative_humidity_2m: 58,
            weather_code: 2,
            wind_speed_10m: 16.2,
            pressure_msl: 1008,
            visibility: 10.1,
          },
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const provider = getWeatherProvider('open-meteo');
    const snapshot = await provider.fetchWeather('Berlin');

    expect(snapshot.locationName).toBe('Berlin, Berlin, Germany');
    expect(snapshot.condition).toBe('Partly cloudy');
    expect(snapshot.temperatureC).toBe(12.4);
  });

  it('maps WTTR response into a snapshot', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          current_condition: [
            {
              temp_C: '21',
              FeelsLikeC: '20',
              humidity: '40',
              pressure: '1012',
              visibility: '10',
              windspeedKmph: '18',
              observation_time: '09:30 AM',
              weatherDesc: [{ value: 'Partly cloudy' }],
            },
          ],
          nearest_area: [
            {
              areaName: [{ value: 'London' }],
              region: [{ value: 'England' }],
              country: [{ value: 'United Kingdom' }],
            },
          ],
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    const provider = getWeatherProvider('wttr');
    const snapshot = await provider.fetchWeather('London');

    expect(snapshot.locationName).toBe('London, England, United Kingdom');
    expect(snapshot.condition).toBe('Partly cloudy');
    expect(snapshot.temperatureC).toBe(21);
  });
});
