import { getLanguageLabel, supportedLanguages } from '../lib/i18n';
import type { Language } from '../lib/i18n';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSwitcherProps {
  value: Language;
  onChange: (value: Language) => void;
}

export function LanguageSwitcher({ value, onChange }: LanguageSwitcherProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="text-xs uppercase tracking-[0.24em] text-white/45">{t('language.label')}</div>
      <div className="grid grid-cols-3 gap-2">
        {supportedLanguages.map((language) => {
          const active = value === language;

          return (
            <button
              key={language}
              type="button"
              onClick={() => onChange(language)}
              className={[
                'rounded-2xl border px-3 py-3 text-sm font-semibold transition duration-200',
                active
                  ? 'border-white/25 bg-white/12 text-white shadow-glow'
                  : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.08]',
              ].join(' ')}
            >
              {getLanguageLabel(language)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
