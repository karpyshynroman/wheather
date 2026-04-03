export type WeatherConditionKey =
  | 'clearSky'
  | 'mainlyClear'
  | 'partlyCloudy'
  | 'cloudy'
  | 'overcast'
  | 'fog'
  | 'depositingRimeFog'
  | 'lightDrizzle'
  | 'drizzle'
  | 'denseDrizzle'
  | 'freezingDrizzle'
  | 'denseFreezingDrizzle'
  | 'slightRain'
  | 'rain'
  | 'heavyRain'
  | 'freezingRain'
  | 'heavyFreezingRain'
  | 'slightSnowFall'
  | 'snowFall'
  | 'heavySnowFall'
  | 'snowGrains'
  | 'rainShowers'
  | 'heavyRainShowers'
  | 'violentRainShowers'
  | 'snowShowers'
  | 'heavySnowShowers'
  | 'thunderstorm'
  | 'thunderstormWithHail'
  | 'severeThunderstormWithHail'
  | 'unknown';

export interface WeatherDescriptor {
  conditionKey: WeatherConditionKey;
  icon: string;
}

const CODE_MAP: Record<number, WeatherDescriptor> = {
  0: { conditionKey: 'clearSky', icon: 'sun' },
  1: { conditionKey: 'mainlyClear', icon: 'sun' },
  2: { conditionKey: 'partlyCloudy', icon: 'cloud-sun' },
  3: { conditionKey: 'overcast', icon: 'cloud' },
  45: { conditionKey: 'fog', icon: 'mist' },
  48: { conditionKey: 'depositingRimeFog', icon: 'mist' },
  51: { conditionKey: 'lightDrizzle', icon: 'rain' },
  53: { conditionKey: 'drizzle', icon: 'rain' },
  55: { conditionKey: 'denseDrizzle', icon: 'rain' },
  56: { conditionKey: 'freezingDrizzle', icon: 'sleet' },
  57: { conditionKey: 'denseFreezingDrizzle', icon: 'sleet' },
  61: { conditionKey: 'slightRain', icon: 'rain' },
  63: { conditionKey: 'rain', icon: 'rain' },
  65: { conditionKey: 'heavyRain', icon: 'rain' },
  66: { conditionKey: 'freezingRain', icon: 'sleet' },
  67: { conditionKey: 'heavyFreezingRain', icon: 'sleet' },
  71: { conditionKey: 'slightSnowFall', icon: 'snow' },
  73: { conditionKey: 'snowFall', icon: 'snow' },
  75: { conditionKey: 'heavySnowFall', icon: 'snow' },
  77: { conditionKey: 'snowGrains', icon: 'snow' },
  80: { conditionKey: 'rainShowers', icon: 'rain' },
  81: { conditionKey: 'heavyRainShowers', icon: 'rain' },
  82: { conditionKey: 'violentRainShowers', icon: 'rain' },
  85: { conditionKey: 'snowShowers', icon: 'snow' },
  86: { conditionKey: 'heavySnowShowers', icon: 'snow' },
  95: { conditionKey: 'thunderstorm', icon: 'storm' },
  96: { conditionKey: 'thunderstormWithHail', icon: 'storm' },
  99: { conditionKey: 'severeThunderstormWithHail', icon: 'storm' },
};

export function describeOpenMeteoCode(code: number): WeatherDescriptor {
  return CODE_MAP[code] ?? { conditionKey: 'unknown', icon: 'cloud' };
}

export function describeTextCondition(condition: string): WeatherDescriptor {
  const normalized = condition.toLowerCase();

  if (normalized.includes('severe') && normalized.includes('hail')) {
    return { conditionKey: 'severeThunderstormWithHail', icon: 'storm' };
  }

  if (normalized.includes('storm') && normalized.includes('hail')) {
    return { conditionKey: 'thunderstormWithHail', icon: 'storm' };
  }

  if (normalized.includes('storm') || normalized.includes('thunder')) {
    return { conditionKey: 'thunderstorm', icon: 'storm' };
  }

  if (normalized.includes('snow') || normalized.includes('sleet') || normalized.includes('hail')) {
    if (normalized.includes('heavy')) {
      return { conditionKey: 'heavySnowShowers', icon: 'snow' };
    }

    return { conditionKey: 'snowShowers', icon: 'snow' };
  }

  if (normalized.includes('drizzle')) {
    if (normalized.includes('heavy') || normalized.includes('dense')) {
      return { conditionKey: 'denseDrizzle', icon: 'rain' };
    }

    return { conditionKey: 'drizzle', icon: 'rain' };
  }

  if (normalized.includes('rain')) {
    if (normalized.includes('heavy') || normalized.includes('violent')) {
      return { conditionKey: 'heavyRainShowers', icon: 'rain' };
    }

    return { conditionKey: 'rainShowers', icon: 'rain' };
  }

  if (normalized.includes('mist') || normalized.includes('fog')) {
    return { conditionKey: 'fog', icon: 'mist' };
  }

  if (normalized.includes('partly')) {
    return { conditionKey: 'partlyCloudy', icon: 'cloud-sun' };
  }

  if (normalized.includes('overcast')) {
    return { conditionKey: 'overcast', icon: 'cloud' };
  }

  if (normalized.includes('cloud')) {
    return { conditionKey: 'cloudy', icon: 'cloud' };
  }

  if (normalized.includes('clear')) {
    return { conditionKey: 'clearSky', icon: 'sun' };
  }

  return { conditionKey: 'unknown', icon: 'sun' };
}
