export type WeatherErrorCode = 'requestFailed' | 'locationNotFound' | 'weatherUnavailable';

export class WeatherError extends Error {
  code: WeatherErrorCode;

  constructor(code: WeatherErrorCode, message?: string) {
    super(message);
    this.code = code;
    this.name = 'WeatherError';
  }
}

