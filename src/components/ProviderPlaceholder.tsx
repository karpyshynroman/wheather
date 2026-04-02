import type { WeatherProviderDefinition } from '../lib/types';
import { useTranslation } from '../hooks/useTranslation';

interface ProviderPlaceholderProps {
  provider: WeatherProviderDefinition;
}

export function ProviderPlaceholder({ provider }: ProviderPlaceholderProps) {
  const { t } = useTranslation();

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-glow">
      <div className="relative flex min-h-[520px] items-center justify-center p-6 sm:p-8">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${provider.accentSoft}, transparent 34%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08), transparent 22%), radial-gradient(circle at 50% 85%, rgba(255,255,255,0.06), transparent 24%)`,
          }}
        />
        <div className="relative flex items-center justify-center">
          <div className="absolute h-72 w-72 animate-spin rounded-full border border-dashed border-white/15" style={{ animationDuration: '18s' }} />
          <div className="absolute h-52 w-52 animate-spin rounded-full border border-dashed border-white/10" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
          <div
            className="flex h-44 w-44 items-center justify-center rounded-full border border-white/10 bg-slate-950/55 shadow-glow animate-pulse"
            style={{
              boxShadow: `0 0 0 1px ${provider.accentSoft}, 0 30px 80px -35px ${provider.accent}`,
            }}
          >
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.24em] text-white/45">{t('provider.placeholder')}</div>
              <div className="mt-2 text-2xl font-semibold text-white">{provider.name}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
