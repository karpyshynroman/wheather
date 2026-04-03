import type { WeatherSnapshot } from '../lib/types';
import { useTranslation } from '../hooks/useTranslation';

interface WeatherPanelProps {
  snapshot?: WeatherSnapshot;
  loading: boolean;
  error?: string;
}

function iconLabel(icon: string): string {
  switch (icon) {
    case 'sun':
      return '☀';
    case 'cloud-sun':
      return '⛅';
    case 'cloud':
      return '☁';
    case 'mist':
      return '〰';
    case 'rain':
      return '☔';
    case 'sleet':
      return '🌨';
    case 'snow':
      return '❄';
    case 'storm':
      return '⚡';
    default:
      return '◌';
  }
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-xs uppercase tracking-[0.22em] text-white/45">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

export function WeatherPanel({ snapshot, loading, error }: WeatherPanelProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
        <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="h-20 w-28 animate-pulse rounded-[1.5rem] bg-white/10" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-24 animate-pulse rounded-2xl bg-white/10" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-5 text-rose-50">
        <div className="text-sm uppercase tracking-[0.22em] text-rose-100/70">{t('weather.unavailable')}</div>
        <p className="mt-3 text-base leading-7">{error}</p>
      </div>
    );
  }

  if (!snapshot) return '';

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-glow">
      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm uppercase tracking-[0.22em] text-white/45">{snapshot.sourceLabel}</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">{snapshot.locationName}</h2>
            <p className="mt-1 text-sm text-white/55">{snapshot.condition}</p>
          </div>
          <div
            className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-3xl"
          >
            {iconLabel(snapshot.icon)}
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-5">
          <div>
            <div className="text-sm uppercase tracking-[0.22em] text-white/40">{t('weather.current')}</div>
            <div className="mt-2 flex items-start gap-2">
              <span className="text-6xl font-semibold tracking-tight text-white">
                {Math.round(snapshot.temperatureC)}
              </span>
              <span className="pt-2 text-2xl font-medium text-white/65">°C</span>
            </div>
          </div>
          <div className="text-right text-sm text-white/55">
            <div>
              {t('weather.feelsLike')} {Math.round(snapshot.feelsLikeC)}°C
            </div>
            <div className="mt-1">
              {t('weather.observed')}{' '}
              {new Date(snapshot.observedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Metric label={t('weather.humidity')} value={`${Math.round(snapshot.humidityPct)}%`} />
          <Metric label={t('weather.wind')} value={`${Math.round(snapshot.windKph)} km/h`} />
          <Metric label={t('weather.pressure')} value={`${Math.round(snapshot.pressureHpa)} hPa`} />
          <Metric label={t('weather.visibility')} value={`${Math.max(0, Math.round(snapshot.visibilityKm))} km`} />
        </div>
      </div>
    </section>
  );
}
