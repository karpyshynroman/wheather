export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface WeatherSearchHistoryItem {
  id: string;
  providerId: 'open-meteo' | 'wttr';
  searchQuery: string;
  locationName: string;
  condition: string | null;
  temperatureC: number | null;
  feelsLikeC: number | null;
  createdAt: string;
}
