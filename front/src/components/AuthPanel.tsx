import { useMemo, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { validateEmailInput, validatePasswordInput } from '../lib/auth-validation';
import type { AuthUser } from '../lib/auth-types';

type AuthMode = 'login' | 'register';

interface AuthPanelProps {
  user: AuthUser | null;
  isSubmitting: boolean;
  error?: string;
  onLogin: (email: string, password: string) => void | Promise<void>;
  onRegister: (email: string, password: string) => void | Promise<void>;
  onLogout: () => void;
}

export function AuthPanel({ user, isSubmitting, error, onLogin, onRegister, onLogout }: AuthPanelProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const resolvedErrors = useMemo(
    () => validationErrors.map((key) => t(key)),
    [t, validationErrors],
  );

  const handleSubmit = async () => {
    const errors = [...validateEmailInput(email), ...validatePasswordInput(password)];
    setValidationErrors(errors);

    if (errors.length > 0) {
      return;
    }

    if (mode === 'login') {
      await onLogin(email.trim().toLowerCase(), password.trim());
    } else {
      await onRegister(email.trim().toLowerCase(), password.trim());
    }
  };

  if (user) {
    return (
      <section className="rounded-[2rem] border border-white/10 bg-slate-950 p-4 sm:p-5">
        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/45">{t('auth.label')}</div>
            <div className="mt-1 text-lg font-semibold text-white">{user.email}</div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/[0.08]"
          >
            {t('auth.logout')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950 p-4 sm:p-5">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={[
              'rounded-2xl px-3 py-3 text-sm font-semibold transition sm:flex-1',
              mode === 'login' ? 'bg-white text-slate-950' : 'bg-white/[0.06] text-white/70',
            ].join(' ')}
          >
            {t('auth.login')}
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={[
              'rounded-2xl px-3 py-3 text-sm font-semibold transition sm:flex-1',
              mode === 'register' ? 'bg-white text-slate-950' : 'bg-white/[0.06] text-white/70',
            ].join(' ')}
          >
            {t('auth.register')}
          </button>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/55">{t('auth.emailLabel')}</span>
          <input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (validationErrors.length > 0) {
                setValidationErrors([]);
              }
            }}
            placeholder="user@example.com"
            className="w-full rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            spellCheck={false}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/55">{t('auth.passwordLabel')}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (validationErrors.length > 0) {
                setValidationErrors([]);
              }
            }}
            placeholder="********"
            className="w-full rounded-3xl border border-white/10 bg-slate-950/55 px-4 py-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/20"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            autoCorrect="off"
            spellCheck={false}
          />
        </label>

        {resolvedErrors.length > 0 && (
          <ul className="space-y-1 rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">
            {resolvedErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}

        {error ? (
          <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>
        ) : null}

        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isSubmitting}
          className="w-full rounded-3xl bg-white px-4 py-4 text-base font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? t('auth.submitting')
            : mode === 'login'
              ? t('auth.login')
              : t('auth.register')}
        </button>
      </div>
    </section>
  );
}
