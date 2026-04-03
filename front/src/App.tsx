import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AuthModal } from './components/AuthModal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { LocationForm } from './components/LocationForm';
import { ProviderPlaceholder } from './components/ProviderPlaceholder';
import { ProviderSwitcher } from './components/ProviderSwitcher';
import { SearchHistoryPanel } from './components/SearchHistoryPanel';
import { WeatherPanel } from './components/WeatherPanel';
import { fetchCurrentUser, fetchSearchHistory } from './lib/auth-api';
import { ApiError } from './lib/api';
import { useTranslation } from './hooks/useTranslation';
import { WeatherError } from './lib/errors';
import { providerDefinitions } from './lib/providers';
import { queryClient } from './lib/query-client';
import { normalizeLocationInput, validateLocationInput } from './lib/validation';
import type { LocationValidationErrorCode } from './lib/validation';
import { useAuthMutation } from './hooks/useAuthMutation';
import { useSaveSearchMutation } from './hooks/useSaveSearchMutation';
import { useWeatherQuery } from './hooks/useWeatherQuery';
import { useAuthStore } from './store/auth-store';
import { useWeatherStore } from './store/weather-store';
import { useQuery } from '@tanstack/react-query';

function AppShell() {
  const providerId = useWeatherStore((state) => state.providerId);
  const draftLocation = useWeatherStore((state) => state.draftLocation);
  const activeLocation = useWeatherStore((state) => state.activeLocation);
  const language = useWeatherStore((state) => state.language);
  const setProviderId = useWeatherStore((state) => state.setProviderId);
  const setDraftLocation = useWeatherStore((state) => state.setDraftLocation);
  const setActiveLocation = useWeatherStore((state) => state.setActiveLocation);
  const setLanguage = useWeatherStore((state) => state.setLanguage);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const markHydrated = useAuthStore((state) => state.markHydrated);
  const provider = providerDefinitions[providerId];
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState<LocationValidationErrorCode[]>([]);
  const [authError, setAuthError] = useState<string | undefined>();
  const [historyError, setHistoryError] = useState<string | undefined>();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const weatherQuery = useWeatherQuery(providerId, activeLocation, language);
  const lastSavedSearchRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    lastSavedSearchRef.current = null;
  }, [token, user?.id]);

  useEffect(() => {
    if (hydrated) {
      return;
    }

    let active = true;

    const bootstrap = async () => {
      if (token) {
        try {
          const currentUser = await fetchCurrentUser(token);
          if (active) {
            setSession({ accessToken: token, user: currentUser });
          }
        } catch {
          if (active) {
            clearSession();
          }
        }
      }

      if (active) {
        markHydrated();
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, [clearSession, hydrated, markHydrated, setSession, token]);

  const resolvedValidationErrors = useMemo(
    () => validationErrors.map((error) => t(`validation.${error}`)),
    [t, validationErrors],
  );

  const authMutation = useAuthMutation({
    onSuccess: (session) => {
      setSession(session);
      setAuthError(undefined);
      setAuthModalOpen(false);
    },
    onError: (message) => {
      setAuthError(message);
    },
  });
  const saveSearchMutation = useSaveSearchMutation({
    token,
    onSuccess: () => {
      if (user) {
        void queryClient.invalidateQueries({ queryKey: ['history', user.id] });
      }
      setHistoryError(undefined);
    },
    onError: (message) => {
      setHistoryError(message);
    },
  });

  const historyQuery = useQuery({
    queryKey: ['history', user?.id],
    enabled: Boolean(token && user),
    queryFn: async () => {
      if (!token) {
        return [];
      }

      return fetchSearchHistory(token);
    },
  });

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

  useEffect(() => {
    if (!token || !user || !weatherQuery.data || !activeLocation || saveSearchMutation.isPending) {
      return;
    }

    const searchQuery = activeLocation.trim();
    const locationName = weatherQuery.data.locationName.trim();
    const providerValue = String(providerId).trim();

    if (searchQuery.length < 2 || locationName.length < 2 || providerValue.length === 0) {
      return;
    }

    const signature = [providerId, activeLocation, weatherQuery.data.observedAt].join('|');
    if (lastSavedSearchRef.current === signature) {
      return;
    }

    lastSavedSearchRef.current = signature;

    void saveSearchMutation
      .mutateAsync({
        providerId: providerValue as 'open-meteo' | 'wttr',
        searchQuery,
        locationName,
        condition: weatherQuery.data.condition,
        temperatureC: weatherQuery.data.temperatureC,
        feelsLikeC: weatherQuery.data.feelsLikeC,
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 401) {
          clearSession();
          return;
        }

        if (error instanceof ApiError) {
          setHistoryError(error.message);
        } else {
          setHistoryError(t('weather.unavailable'));
        }
      });
  }, [activeLocation, clearSession, providerId, saveSearchMutation, token, user, weatherQuery.data]);

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
      <div className="fixed right-4 top-4 z-30 sm:right-6 sm:top-6 lg:right-10 lg:top-10">
        <button
          type="button"
          onClick={() => setAuthModalOpen(true)}
          className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/15"
        >
          {t('auth.open')}
        </button>
      </div>
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

            <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
              {!weatherQuery.data && !weatherQuery.isFetching ? (
                <ProviderPlaceholder provider={provider} />
              ) : (
                <WeatherPanel
                  loading={weatherQuery.isFetching && !weatherQuery.data}
                  snapshot={weatherQuery.data}
                  error={weatherError}
                />
              )}

              {token && user ? (
                <SearchHistoryPanel
                  items={historyQuery.data ?? []}
                  loading={historyQuery.isFetching && !historyQuery.data}
                  error={historyError}
                />
              ) : null}
            </div>
          </div>
          <AuthModal
            open={authModalOpen}
            user={user}
            isSubmitting={authMutation.isPending}
            error={authError}
            onLogin={async (email, password) => {
              await authMutation.mutateAsync({ email, password, mode: 'login' });
            }}
            onRegister={async (email, password) => {
              await authMutation.mutateAsync({ email, password, mode: 'register' });
            }}
            onLogout={() => {
              clearSession();
              void queryClient.removeQueries({ queryKey: ['history'] });
              setAuthError(undefined);
              setAuthModalOpen(false);
            }}
            onClose={() => setAuthModalOpen(false)}
          />
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
