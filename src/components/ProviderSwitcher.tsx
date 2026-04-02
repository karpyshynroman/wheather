import { providerDefinitions } from '../lib/providers';
import type { WeatherProviderId } from '../lib/types';

interface ProviderSwitcherProps {
  value: WeatherProviderId;
  onChange: (value: WeatherProviderId) => void;
}

export function ProviderSwitcher({ value, onChange }: ProviderSwitcherProps) {
  const providers = Object.values(providerDefinitions);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {providers.map((provider) => {
        const active = provider.id === value;

        return (
          <button
            key={provider.id}
            type="button"
            onClick={() => onChange(provider.id)}
            className={[
              'group relative overflow-hidden rounded-3xl border p-4 text-left transition duration-200',
              active
                ? 'border-white/25 bg-white/10 shadow-glow'
                : 'border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]',
            ].join(' ')}
          >
            <span
              className="absolute inset-0 opacity-80 transition duration-300 group-hover:opacity-100"
              style={{
                background: active
                  ? `linear-gradient(135deg, ${provider.accentSoft}, rgba(255,255,255,0.03))`
                  : 'transparent',
              }}
            />
            <span className="relative flex items-center justify-between gap-3">
              <span className="space-y-1">
                <span className="block text-sm font-medium uppercase tracking-[0.22em] text-white/60">
                  {provider.shortName}
                </span>
                <span className="block text-lg font-semibold text-white">{provider.name}</span>
              </span>
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: active ? provider.accent : 'rgba(255,255,255,0.35)' }}
              />
            </span>
            <span className="relative mt-3 block text-sm leading-6 text-white/72">{provider.tagline}</span>
          </button>
        );
      })}
    </div>
  );
}
