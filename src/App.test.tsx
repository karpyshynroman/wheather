import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App', () => {
  it('validates input and refreshes data when switching providers', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              name: 'Tallinn',
              admin1: 'Harju County',
              country: 'Estonia',
              latitude: 59.437,
              longitude: 24.753,
            },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            time: '2026-04-02T10:00',
            temperature_2m: 8,
            apparent_temperature: 6,
            relative_humidity_2m: 66,
            weather_code: 1,
            wind_speed_10m: 12,
            pressure_msl: 1015,
            visibility: 10,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_condition: [
            {
              temp_C: '7',
              FeelsLikeC: '5',
              humidity: '70',
              pressure: '1016',
              visibility: '9',
              windspeedKmph: '11',
              observation_time: '10:00 AM',
              weatherDesc: [{ value: 'Clear' }],
            },
          ],
          nearest_area: [
            {
              areaName: [{ value: 'Tallinn' }],
              region: [{ value: 'Harju County' }],
              country: [{ value: 'Estonia' }],
            },
          ],
        }),
      });

    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /show weather/i }));
    expect(await screen.findByText('Enter a location to search for weather.')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/try helsinki/i), { target: { value: 'Tallinn' } });
    fireEvent.click(screen.getByRole('button', { name: /show weather/i }));

    expect(await screen.findByText('Tallinn, Harju County, Estonia')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /wttr/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    expect(await screen.findByText('Tallinn, Harju County, Estonia')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
