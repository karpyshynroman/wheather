import { QueryClientProvider } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { LocationForm } from './components/LocationForm';
import { ProviderSwitcher } from './components/ProviderSwitcher';
import { WeatherPanel } from './components/WeatherPanel';
import { providerDefinitions } from './lib/providers';
import { queryClient } from './lib/query-client';
import { normalizeLocationInput, validateLocationInput } from './lib/validation';
import { useWeatherQuery } from './hooks/useWeatherQuery';
import { useWeatherStore } from './store/weather-store';

function AppShell() {
  const providerId = useWeatherStore((state) => state.providerId);
  const draftLocation = useWeatherStore((state) => state.draftLocation);
  const activeLocation = useWeatherStore((state) => state.activeLocation);
  const setProviderId = useWeatherStore((state) => state.setProviderId);
  const setDraftLocation = useWeatherStore((state) => state.setDraftLocation);
  const setActiveLocation = useWeatherStore((state) => state.setActiveLocation);
  const provider = providerDefinitions[providerId];
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const weatherQuery = useWeatherQuery(providerId, activeLocation);

  const statusText = useMemo(() => {
    if (!activeLocation) {
      return 'Search a location to fetch live data.';
    }

    if (weatherQuery.isFetching && weatherQuery.data) {
      return `Refreshing ${activeLocation} with ${provider.shortName}.`;
    }

    if (weatherQuery.isFetching) {
      return `Loading ${activeLocation} with ${provider.shortName}.`;
    }

    return `Showing ${activeLocation} with ${provider.shortName}.`;
  }, [activeLocation, provider.shortName, weatherQuery.data, weatherQuery.isFetching]);

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
              <header className="space-y-3 lg:space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/60">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: provider.accent }} />
                  {provider.name}
                </div>
                <div className="space-y-4">
                  <p className="max-w-prose text-sm leading-7 text-white/62 sm:text-base lg:text-lg lg:leading-8">
                    Choose provider
                  </p>
                </div>
              </header>

              <ProviderSwitcher value={providerId} onChange={setProviderId} />

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                <LocationForm
                  value={draftLocation}
                  errors={validationErrors}
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
                    <div className="text-xs uppercase tracking-[0.24em] text-white/45">Status</div>
                    <div className="mt-1 text-sm text-white/70">{statusText}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-8 lg:self-start">
              <WeatherPanel
                loading={weatherQuery.isFetching && !weatherQuery.data}
                snapshot={weatherQuery.data}
                error={weatherQuery.error instanceof Error ? weatherQuery.error.message : undefined}
              />
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
