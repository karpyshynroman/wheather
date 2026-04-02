export type WeatherProviderId = 'open-meteo' | 'wttr';

export interface WeatherSnapshot {
  locationName: string;
  sourceLabel: string;
  condition: string;
  icon: string;
  temperatureC: number;
  feelsLikeC: number;
  humidityPct: number;
  windKph: number;
  pressureHpa: number;
  visibilityKm: number;
  observedAt: string;
}

export interface WeatherProviderDefinition {
  id: WeatherProviderId;
  name: string;
  shortName: string;
  tagline: string;
  accent: string;
  accentSoft: string;
  emphasis: string;
}
