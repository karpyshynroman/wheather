import { useEffect } from 'react';
import { AuthPanel } from './AuthPanel';
import type { AuthUser } from '../lib/auth-types';
import { useTranslation } from '../hooks/useTranslation';

interface AuthModalProps {
  open: boolean;
  user: AuthUser | null;
  isSubmitting: boolean;
  error?: string;
  onLogin: (email: string, password: string) => void | Promise<void>;
  onRegister: (email: string, password: string) => void | Promise<void>;
  onLogout: () => void;
  onClose: () => void;
}

export function AuthModal({
  open,
  user,
  isSubmitting,
  error,
  onLogin,
  onRegister,
  onLogout,
  onClose,
}: AuthModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950 px-4 py-6 sm:items-center sm:py-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md rounded-[2.25rem] border border-white/10 bg-slate-950 px-1 pb-1 pt-14 shadow-2xl sm:pt-12">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:bg-white/15"
        >
          {t('auth.close')}
        </button>

        <AuthPanel
          user={user}
          isSubmitting={isSubmitting}
          error={error}
          onLogin={onLogin}
          onRegister={onRegister}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
}
