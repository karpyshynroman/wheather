import { providerDefinitions } from '../lib/providers';
import type { WeatherSearchHistoryItem } from '../lib/auth-types';
import { useTranslation } from '../hooks/useTranslation';

interface SearchHistoryPanelProps {
  items: WeatherSearchHistoryItem[];
  loading: boolean;
  error?: string;
}

export function SearchHistoryPanel({ items, loading, error }: SearchHistoryPanelProps) {
  const { t } = useTranslation();

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-glow">
      <div className="space-y-4 p-5">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-white/45">{t('history.label')}</div>
          <h3 className="mt-2 text-xl font-semibold text-white">{t('history.title')}</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-16 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-16 animate-pulse rounded-2xl bg-white/10" />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm leading-7 text-white/58">{t('history.empty')}</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-white/42">
                      {providerDefinitions[item.providerId].name}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">{item.locationName}</div>
                  </div>
                  <div className="text-right text-xs text-white/45">
                    {new Date(item.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/65">
                  <span className="rounded-full bg-white/10 px-3 py-1">{item.searchQuery}</span>
                  {item.condition ? <span className="rounded-full bg-white/10 px-3 py-1">{item.condition}</span> : null}
                  {item.temperatureC !== null ? <span className="rounded-full bg-white/10 px-3 py-1">{Math.round(item.temperatureC)}°C</span> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
