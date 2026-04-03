export const supportedLanguages = ['en', 'de', 'uk'] as const;

export type Language = (typeof supportedLanguages)[number];

export type TranslationParams = Record<string, string | number>;

export interface TranslationNode {
  [key: string]: string | TranslationNode;
}

const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  de: 'Deutsch',
  uk: 'Українська',
};

const translations: Record<Language, TranslationNode> = {
  en: {
    app: {
      status: {
        label: 'Status',
        idle: 'Search a location to fetch live data.',
        loading: 'Loading {{location}} with {{provider}}.',
        refreshing: 'Refreshing {{location}} with {{provider}}.',
        showing: 'Showing {{location}} with {{provider}}.',
      },
    },
    language: {
      label: 'Language',
    },
    auth: {
      label: 'Account',
      open: 'Account',
      emailLabel: 'Email',
      passwordLabel: 'Password',
      login: 'Log in',
      register: 'Create account',
      logout: 'Log out',
      close: 'Close',
      submitting: 'Submitting…',
      email: {
        required: 'Enter an email address.',
        invalid: 'Enter a valid email address.',
        tooLong: 'Email must be 254 characters or fewer.',
      },
      password: {
        required: 'Enter a password.',
        tooShort: 'Password must be at least 8 characters.',
        tooLong: 'Password must be 128 characters or fewer.',
      },
    },
    form: {
      locationLabel: 'Location',
      placeholder: 'Try Helsinki, Tokyo, or New York',
      submit: 'Show weather',
      loading: 'Loading weather…',
    },
    validation: {
      empty: 'Enter a location to search for weather.',
      tooShort: 'Location must contain at least 2 characters.',
      tooLong: 'Location must be 80 characters or fewer.',
      invalidCharacters: 'Use only letters, numbers, spaces, and basic punctuation.',
      missingAlphaNumeric: 'Location must include at least one letter or number.',
    },
    provider: {
      placeholder: 'Provider',
    },
    history: {
      label: 'History',
      title: 'Weather searches',
      empty: 'No saved weather searches yet.',
    },
    weather: {
      unavailable: 'Weather unavailable',
      requestFailed: 'The weather service request failed.',
      locationNotFound: 'No matching location was found.',
      weatherUnavailable: 'Weather data is unavailable for this location.',
      current: 'Current',
      feelsLike: 'Feels like',
      observed: 'Observed',
      humidity: 'Humidity',
      wind: 'Wind',
      pressure: 'Pressure',
      visibility: 'Visibility',
      clearSky: 'Clear sky',
      mainlyClear: 'Mainly clear',
      partlyCloudy: 'Partly cloudy',
      cloudy: 'Cloudy',
      overcast: 'Overcast',
      fog: 'Fog',
      depositingRimeFog: 'Depositing rime fog',
      lightDrizzle: 'Light drizzle',
      drizzle: 'Drizzle',
      denseDrizzle: 'Dense drizzle',
      freezingDrizzle: 'Freezing drizzle',
      denseFreezingDrizzle: 'Dense freezing drizzle',
      slightRain: 'Slight rain',
      rain: 'Rain',
      heavyRain: 'Heavy rain',
      freezingRain: 'Freezing rain',
      heavyFreezingRain: 'Heavy freezing rain',
      slightSnowFall: 'Slight snow fall',
      snowFall: 'Snow fall',
      heavySnowFall: 'Heavy snow fall',
      snowGrains: 'Snow grains',
      rainShowers: 'Rain showers',
      heavyRainShowers: 'Heavy rain showers',
      violentRainShowers: 'Violent rain showers',
      snowShowers: 'Snow showers',
      heavySnowShowers: 'Heavy snow showers',
      thunderstorm: 'Thunderstorm',
      thunderstormWithHail: 'Thunderstorm with hail',
      severeThunderstormWithHail: 'Severe thunderstorm with hail',
      unknown: 'Unknown weather',
    },
  },
  de: {
    app: {
      status: {
        label: 'Status',
        idle: 'Suche einen Ort, um Live-Daten abzurufen.',
        loading: 'Wetter für {{location}} mit {{provider}} wird geladen.',
        refreshing: 'Wetter für {{location}} mit {{provider}} wird aktualisiert.',
        showing: 'Wetter für {{location}} mit {{provider}} wird angezeigt.',
      },
    },
    language: {
      label: 'Sprache',
    },
    auth: {
      label: 'Konto',
      open: 'Konto',
      emailLabel: 'E-Mail',
      passwordLabel: 'Passwort',
      login: 'Anmelden',
      register: 'Konto erstellen',
      logout: 'Abmelden',
      close: 'Schließen',
      submitting: 'Wird gesendet…',
      email: {
        required: 'Gib eine E-Mail-Adresse ein.',
        invalid: 'Gib eine gültige E-Mail-Adresse ein.',
        tooLong: 'Die E-Mail darf höchstens 254 Zeichen lang sein.',
      },
      password: {
        required: 'Gib ein Passwort ein.',
        tooShort: 'Das Passwort muss mindestens 8 Zeichen haben.',
        tooLong: 'Das Passwort darf höchstens 128 Zeichen lang sein.',
      },
    },
    form: {
      locationLabel: 'Ort',
      placeholder: 'Versuche Helsinki, Tokio oder New York',
      submit: 'Wetter anzeigen',
      loading: 'Wetter wird geladen…',
    },
    validation: {
      empty: 'Gib einen Ort ein, um das Wetter zu suchen.',
      tooShort: 'Der Ort muss mindestens 2 Zeichen enthalten.',
      tooLong: 'Der Ort darf höchstens 80 Zeichen lang sein.',
      invalidCharacters: 'Verwende nur Buchstaben, Zahlen, Leerzeichen und einfache Satzzeichen.',
      missingAlphaNumeric: 'Der Ort muss mindestens einen Buchstaben oder eine Zahl enthalten.',
    },
    provider: {
      placeholder: 'Anbieter',
    },
    history: {
      label: 'Verlauf',
      title: 'Wetter-Suchen',
      empty: 'Noch keine gespeicherten Wetter-Suchen.',
    },
    weather: {
      unavailable: 'Wetter nicht verfügbar',
      requestFailed: 'Die Wetteranfrage ist fehlgeschlagen.',
      locationNotFound: 'Kein passender Ort wurde gefunden.',
      weatherUnavailable: 'Wetterdaten sind für diesen Ort nicht verfügbar.',
      current: 'Aktuell',
      feelsLike: 'Gefühlt',
      observed: 'Beobachtet',
      humidity: 'Luftfeuchtigkeit',
      wind: 'Wind',
      pressure: 'Luftdruck',
      visibility: 'Sichtweite',
      clearSky: 'Klarer Himmel',
      mainlyClear: 'Überwiegend klar',
      partlyCloudy: 'Teilweise bewölkt',
      cloudy: 'Bewölkt',
      overcast: 'Bedeckt',
      fog: 'Nebel',
      depositingRimeFog: 'Raureifnebel',
      lightDrizzle: 'Leichter Nieselregen',
      drizzle: 'Nieselregen',
      denseDrizzle: 'Starker Nieselregen',
      freezingDrizzle: 'Gefrierender Nieselregen',
      denseFreezingDrizzle: 'Starker gefrierender Nieselregen',
      slightRain: 'Leichter Regen',
      rain: 'Regen',
      heavyRain: 'Starker Regen',
      freezingRain: 'Gefrierender Regen',
      heavyFreezingRain: 'Starker gefrierender Regen',
      slightSnowFall: 'Leichter Schneefall',
      snowFall: 'Schneefall',
      heavySnowFall: 'Starker Schneefall',
      snowGrains: 'Schneegriesel',
      rainShowers: 'Regenschauer',
      heavyRainShowers: 'Starke Regenschauer',
      violentRainShowers: 'Heftige Regenschauer',
      snowShowers: 'Schneeschauer',
      heavySnowShowers: 'Starke Schneeschauer',
      thunderstorm: 'Gewitter',
      thunderstormWithHail: 'Gewitter mit Hagel',
      severeThunderstormWithHail: 'Schweres Gewitter mit Hagel',
      unknown: 'Unbekanntes Wetter',
    },
  },
  uk: {
    app: {
      status: {
        label: 'Статус',
        idle: 'Почніть пошук міста, щоб отримати погоду.',
        loading: 'Завантаження погоди для {{location}} через {{provider}}.',
        refreshing: 'Оновлення погоди для {{location}} через {{provider}}.',
        showing: 'Показано погоду для {{location}} через {{provider}}.',
      },
    },
    language: {
      label: 'Мова',
    },
    auth: {
      label: 'Обліковий запис',
      open: 'Обліковий запис',
      emailLabel: 'Email',
      passwordLabel: 'Пароль',
      login: 'Увійти',
      register: 'Створити акаунт',
      logout: 'Вийти',
      close: 'Закрити',
      submitting: 'Надсилання…',
      email: {
        required: 'Введіть адресу електронної пошти.',
        invalid: 'Введіть дійсну адресу електронної пошти.',
        tooLong: 'Адреса не може бути довшою за 254 символи.',
      },
      password: {
        required: 'Введіть пароль.',
        tooShort: 'Пароль має містити щонайменше 8 символів.',
        tooLong: 'Пароль має бути не довшим за 128 символів.',
      },
    },
    form: {
      locationLabel: 'Локація',
      placeholder: 'Спробуйте Helsinki, Tokyo або New York',
      submit: 'Показати погоду',
      loading: 'Завантаження погоди…',
    },
    validation: {
      empty: 'Введіть локацію, щоб шукати погоду.',
      tooShort: 'Локація має містити щонайменше 2 символи.',
      tooLong: 'Локація має бути не довшою за 80 символів.',
      invalidCharacters: 'Використовуйте лише літери, цифри, пробіли та базову пунктуацію.',
      missingAlphaNumeric: 'Локація має містити щонайменше одну літеру або цифру.',
    },
    provider: {
      placeholder: 'Провайдер',
    },
    history: {
      label: 'Історія',
      title: 'Пошук погоди',
      empty: 'Збережених пошуків погоди ще немає.',
    },
    weather: {
      unavailable: 'Погода недоступна',
      requestFailed: 'Не вдалося виконати запит до сервісу погоди.',
      locationNotFound: 'Не знайдено відповідної локації.',
      weatherUnavailable: 'Дані про погоду для цієї локації недоступні.',
      current: 'Зараз',
      feelsLike: 'Відчувається як',
      observed: 'Зафіксовано',
      humidity: 'Вологість',
      wind: 'Вітер',
      pressure: 'Тиск',
      visibility: 'Видимість',
      clearSky: 'Ясне небо',
      mainlyClear: 'Переважно ясно',
      partlyCloudy: 'Мінлива хмарність',
      cloudy: 'Хмарно',
      overcast: 'Похмуро',
      fog: 'Туман',
      depositingRimeFog: 'Інійний туман',
      lightDrizzle: 'Легка мжичка',
      drizzle: 'Мжичка',
      denseDrizzle: 'Сильна мжичка',
      freezingDrizzle: 'Морозна мжичка',
      denseFreezingDrizzle: 'Сильна морозна мжичка',
      slightRain: 'Невеликий дощ',
      rain: 'Дощ',
      heavyRain: 'Сильний дощ',
      freezingRain: 'Морозний дощ',
      heavyFreezingRain: 'Сильний морозний дощ',
      slightSnowFall: 'Невеликий сніг',
      snowFall: 'Снігопад',
      heavySnowFall: 'Сильний снігопад',
      snowGrains: 'Снігові зерна',
      rainShowers: 'Зливи',
      heavyRainShowers: 'Сильні зливи',
      violentRainShowers: 'Потужні зливи',
      snowShowers: 'Снігопади',
      heavySnowShowers: 'Сильні снігопади',
      thunderstorm: 'Гроза',
      thunderstormWithHail: 'Гроза з градом',
      severeThunderstormWithHail: 'Сильна гроза з градом',
      unknown: 'Невідома погода',
    },
  },
};

export function isSupportedLanguage(value: string): value is Language {
  return (supportedLanguages as readonly string[]).includes(value);
}

export function normalizeLanguageTag(value: string | undefined | null): Language | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toLowerCase().replace('_', '-');
  const base = normalized.split('-')[0];

  return isSupportedLanguage(base) ? base : undefined;
}

export function getLanguageLabel(language: Language): string {
  return LANGUAGE_LABELS[language];
}

export function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    try {
      const stored = window.localStorage.getItem('weather-language');
      const storedLanguage = normalizeLanguageTag(stored);
      if (storedLanguage) {
        return storedLanguage;
      }
    } catch {
      // Ignore storage access issues and fall back to the browser locale.
    }
  }

  if (typeof navigator !== 'undefined') {
    const browserLanguage = normalizeLanguageTag(navigator.languages?.[0] ?? navigator.language);
    if (browserLanguage) {
      return browserLanguage;
    }
  }

  return 'en';
}

export function persistLanguage(language: Language) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem('weather-language', language);
  } catch {
    // Ignore storage write failures.
  }
}

export function translate(language: Language, key: string, params?: TranslationParams): string {
  const template = resolveTranslation(translations[language], key) ?? resolveTranslation(translations.en, key) ?? key;

  if (!params) {
    return template;
  }

  return Object.entries(params).reduce(
    (value, [paramKey, paramValue]) => value.split(`{{${paramKey}}}`).join(String(paramValue)),
    template,
  );
}

function resolveTranslation(tree: TranslationNode, key: string): string | undefined {
  const segments = key.split('.');
  let current: string | TranslationNode | undefined = tree;

  for (const segment of segments) {
    if (!current || typeof current === 'string') {
      return undefined;
    }

    current = current[segment];
  }

  return typeof current === 'string' ? current : undefined;
}
