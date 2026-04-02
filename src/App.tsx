import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LocationForm } from './components/LocationForm';
import { ProviderPlaceholder } from './components/ProviderPlaceholder';
import { ProviderSwitcher } from './components/ProviderSwitcher';
import { WeatherPanel } from './components/WeatherPanel';
import { useTranslation } from './hooks/useTranslation';
import { WeatherError } from './lib/errors';
import { providerDefinitions } from './lib/providers';
import { queryClient } from './lib/query-client';
import { normalizeLocationInput, validateLocationInput } from './lib/validation';
import type { LocationValidationErrorCode } from './lib/validation';
import { useWeatherQuery } from './hooks/useWeatherQuery';
import { useWeatherStore } from './store/weather-store';

function AppShell() {
  const providerId = useWeatherStore((state) => state.providerId);
  const draftLocation = useWeatherStore((state) => state.draftLocation);
  const activeLocation = useWeatherStore((state) => state.activeLocation);
  const language = useWeatherStore((state) => state.language);
  const setProviderId = useWeatherStore((state) => state.setProviderId);
  const setDraftLocation = useWeatherStore((state) => state.setDraftLocation);
  const setActiveLocation = useWeatherStore((state) => state.setActiveLocation);
  const setLanguage = useWeatherStore((state) => state.setLanguage);
  const provider = providerDefinitions[providerId];
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState<LocationValidationErrorCode[]>([]);
  const weatherQuery = useWeatherQuery(providerId, activeLocation, language);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const resolvedValidationErrors = useMemo(
    () => validationErrors.map((error) => t(`validation.${error}`)),
    [t, validationErrors],
  );

  const statusText = useMemo(() => {
    if (!activeLocation) {
      return t('app.status.idle');
    }

    if (weatherQuery.isFetching && weatherQuery.data) {
      return t('app.status.refreshing', { location: activeLocation, provider: provider.name });
    }

    if (weatherQuery.isFetching) {
      return t('app.status.loading', { location: activeLocation, provider: provider.name });
    }

    return t('app.status.showing', { location: activeLocation, provider: provider.name });
  }, [activeLocation, provider.name, t, weatherQuery.data, weatherQuery.isFetching]);

  const weatherError = useMemo(() => {
    const error = weatherQuery.error;

    if (error instanceof WeatherError) {
      return t(`weather.${error.code}`);
    }

    return error instanceof Error ? t('weather.unavailable') : undefined;
  }, [t, weatherQuery.error]);

  const handleSubmit = () => {
    const errors = validateLocationInput(draftLocation);
    setValidationErrors(errors);

    if (errors.length > 0) {
      return;
    }

    setActiveLocation(normalizeLocationInput(draftLocation));
  };

  return (
    <div className="min-h-screen px-4 py-5 sm:px-6 lg:px-10 lg:py-10">
      <main
        className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-col justify-center lg:min-h-[calc(100vh-5rem)]"
        data-provider={providerId}
      >
        <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/60 p-4 shadow-glow backdrop-blur-xl sm:p-6 lg:p-8">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(circle at top left, ${provider.accentSoft}, transparent 35%), radial-gradient(circle at right center, rgba(255,255,255,0.08), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 40%)`,
            }}
          />
          <div className="relative grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
            <div className="space-y-5 lg:space-y-6">
              <header className="space-y-4 lg:space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <p className="max-w-prose text-sm leading-7 text-white/62 sm:text-base lg:text-lg lg:leading-8">
                    {t('app.chooseProvider')}
                  </p>
                  <div className="w-full max-w-xs lg:w-72">
                    <LanguageSwitcher value={language} onChange={setLanguage} />
                  </div>
                </div>
              </header>

              <ProviderSwitcher value={providerId} onChange={setProviderId} />

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <LocationForm
                  value={draftLocation}
                  errors={resolvedValidationErrors}
                  onChange={(value) => {
                    setDraftLocation(value);
                    if (validationErrors.length > 0) {
                      setValidationErrors([]);
                    }
                  }}
                  onSubmit={handleSubmit}
                  isSubmitting={weatherQuery.isFetching && !weatherQuery.data}
                />
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/40 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-white/45">{t('app.status.label')}</div>
                    <div className="mt-1 text-sm text-white/70">{statusText}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-8 lg:self-start">
              {!weatherQuery.data && !weatherQuery.isFetching ? (
                <ProviderPlaceholder provider={provider} />
              ) : (
                <WeatherPanel
                  loading={weatherQuery.isFetching && !weatherQuery.data}
                  snapshot={weatherQuery.data}
                  error={weatherError}
                />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
