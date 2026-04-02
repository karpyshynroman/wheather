export interface WeatherDescriptor {
  condition: string;
  icon: string;
}

const CODE_MAP: Record<number, WeatherDescriptor> = {
  0: { condition: 'Clear sky', icon: 'sun' },
  1: { condition: 'Mainly clear', icon: 'sun' },
  2: { condition: 'Partly cloudy', icon: 'cloud-sun' },
  3: { condition: 'Overcast', icon: 'cloud' },
  45: { condition: 'Fog', icon: 'mist' },
  48: { condition: 'Depositing rime fog', icon: 'mist' },
  51: { condition: 'Light drizzle', icon: 'rain' },
  53: { condition: 'Drizzle', icon: 'rain' },
  55: { condition: 'Dense drizzle', icon: 'rain' },
  56: { condition: 'Freezing drizzle', icon: 'sleet' },
  57: { condition: 'Dense freezing drizzle', icon: 'sleet' },
  61: { condition: 'Slight rain', icon: 'rain' },
  63: { condition: 'Rain', icon: 'rain' },
  65: { condition: 'Heavy rain', icon: 'rain' },
  66: { condition: 'Freezing rain', icon: 'sleet' },
  67: { condition: 'Heavy freezing rain', icon: 'sleet' },
  71: { condition: 'Slight snow fall', icon: 'snow' },
  73: { condition: 'Snow fall', icon: 'snow' },
  75: { condition: 'Heavy snow fall', icon: 'snow' },
  77: { condition: 'Snow grains', icon: 'snow' },
  80: { condition: 'Rain showers', icon: 'rain' },
  81: { condition: 'Heavy rain showers', icon: 'rain' },
  82: { condition: 'Violent rain showers', icon: 'rain' },
  85: { condition: 'Snow showers', icon: 'snow' },
  86: { condition: 'Heavy snow showers', icon: 'snow' },
  95: { condition: 'Thunderstorm', icon: 'storm' },
  96: { condition: 'Thunderstorm with hail', icon: 'storm' },
  99: { condition: 'Severe thunderstorm with hail', icon: 'storm' },
};

export function describeOpenMeteoCode(code: number): WeatherDescriptor {
  return CODE_MAP[code] ?? { condition: 'Unknown weather', icon: 'cloud' };
}

export function describeTextCondition(condition: string): WeatherDescriptor {
  const normalized = condition.toLowerCase();

  if (normalized.includes('storm') || normalized.includes('thunder')) {
    return { condition, icon: 'storm' };
  }

  if (normalized.includes('snow') || normalized.includes('sleet') || normalized.includes('hail')) {
    return { condition, icon: 'snow' };
  }

  if (normalized.includes('rain') || normalized.includes('drizzle')) {
    return { condition, icon: 'rain' };
  }

  if (normalized.includes('mist') || normalized.includes('fog')) {
    return { condition, icon: 'mist' };
  }

  if (normalized.includes('cloud')) {
    return normalized.includes('partly') ? { condition, icon: 'cloud-sun' } : { condition, icon: 'cloud' };
  }

  return { condition, icon: 'sun' };
}

